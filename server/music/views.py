from django.db.models import Avg, Q
  
from django.utils.crypto import get_random_string

from rest_framework import generics, views, status

from rest_framework.decorators import api_view
from rest_framework.response import Response
from music.models import Playlist,RecordCompany, Album, UserProfile, ConfirmationCode, Track, Artist, TrackArtistColab
from music.serializers import (RecordCompanySerializer, TrackArtistColabCreateSerializer, AlbumSerializer, AlbumDetailSerializer,
                          TrackArtistColab,ArtistCreateSerializer,AlbumCreateSerializer,TrackCreateSerializer,AlbumListSerializer,TrackListSerializer,
                          TrackLightSerializer,ArtistListSerializer, ArtistAverageRoyaltySerializer,
                          RecordCompanyAverageSalesSerializer,ArtistDetailSerializer,TrackSerializer,
                           TrackArtistColabDetailSerializer , RecordCompanyAverageSalesSerializer,
                          TrackDetailSerializer,UserProfileSerializer, RegisterSerializer, TrackArtistColabSerializer, 
                          TrackArtistColabCreateSerializer,CustomUserSerializer,UpdateNicknameSerializer)

from math import ceil
import logging
from django.db import connection
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from music.permissions import IsAdminUser, IsAuthenticatedWithJWT, IsOwnerOrReadOnly
from music.recomandation import recomand_tracks
CustomUser = get_user_model()


logger = logging.getLogger(__name__)


def custom_paginate(queryset, page, page_size):
    start = (page - 1) * page_size
    end = start + page_size

    
    total_items = queryset.count()  # Get the exact count
    total_pages = ceil(total_items / page_size)
    sliced_queryset = queryset[start:end]
    # Use raw SQL for pagination
    # raw_query = f"SELECT * FROM {queryset.model._meta.db_table} ORDER BY id LIMIT {page_size} OFFSET {start}"
    # sliced_queryset = queryset.raw(raw_query)

    return sliced_queryset, total_pages



class RecommendSongs(views.APIView):
    def get(self, request, user_id, format=None):


        # Call your recommend_songs function
        recommended_songs_ids = recomand_tracks(user_id=user_id, n_recommendations=10)
        # Get Track model instances for the recommended songs
        recommended_songs = Track.objects.filter(id__in=recommended_songs_ids)
        # Serialize the queryset
        serializer = TrackLightSerializer(recommended_songs,many=True)

        return Response(serializer.data)

class PermissionEnforcementMixin:
    """
    A mixin that adds permission enforcement for unsafe methods.
    """
    def check_permissions(self, request):
        """
        Overriding the original method to add custom behaviour.
        """
        # Call the original check_permissions method

        super().check_permissions(request)

        # Add additional check for object permissions
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            logging.info(f"CHECKING {self.get_object()}")
            self.check_object_permissions(request, self.get_object())

        return True


class UpdateNicknameView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdateNicknameSerializer
    permission_classes = [IsAuthenticatedWithJWT, IsOwnerOrReadOnly]

    def get_object(self):
        return self.request.user

class UserProfileView(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]
    queryset = CustomUser.objects.all()
    def get(self, request, pk=None):

        user = CustomUser.objects.get(pk=pk)
        user_profile = UserProfile.objects.get(user=user)
        serializer = UserProfileSerializer(user_profile)

        return Response(serializer.data)


    def put(self, request, pk):
        logging.info(f"Is user authenticated? {request.user.is_authenticated}")
        logging.info(f"request.user: {request.user}")
        user = CustomUser.objects.get(pk=pk)
        user_profile = UserProfile.objects.get(user=user)
        # self.has_object_permission(request, user, user_profile)
        # self.check_object_permissions(request, user_profile)

        logging.info(f"user_profile: {user_profile}")        

        serializer = UserProfileSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSearchView(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def get(self, request, query):
        try:
            user = None
            if query.isdigit():  # Check if query is a number (i.e., a user ID)
                user = CustomUser.objects.get(pk=query)
            else:  # If not, treat it as a username
                user = CustomUser.objects.get(username=query)

            if user:
                serializer = CustomUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminUserListEditor(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT,IsAdminUser]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')

        if query == '' or query is None:
            return CustomUser.objects.all()
        queryset = CustomUser.objects.filter(Q(username__icontains=query))
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 10)
        queryset, total_pages = custom_paginate(queryset, int(page), int(page_size))

        serializer = CustomUserSerializer(queryset, many=True)
        return Response({
            'total_pages': total_pages,
            'results': serializer.data
        })

class AdminUserEditor(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsAdminUser]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
 

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            logging.info(f"serializer.data: {serializer.validated_data}")
            user = serializer.save()
            logging.info(f"user: {user}")
            # Create a confirmation code
            code = get_random_string(length=32)
            ConfirmationCode.objects.create(user=user, code=code, expiry_date=timezone.now()+timedelta(minutes=10))
            # TODO: send email with the confirmation code to the user
            logging.info(f"code: {code}") 
            return Response({"message": "User registered successfully. A confirmation code has been sent.", "confirmation_code": code}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmRegistrationView(views.APIView):
    def get(self, request, confirmation_code):
        try:
            confirmation = ConfirmationCode.objects.get(code=confirmation_code)
            if timezone.now() > confirmation.expiry_date:
                return Response({"error": "Confirmation code expired."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = confirmation.user
                user.is_active = True
                user.save()
                logging.info(f"user: {user}")
                UserProfile.objects.create(user=user)

                confirmation.delete()
                return Response({"message": "Account confirmed successfully."}, status=status.HTTP_200_OK)
        except ConfirmationCode.DoesNotExist:
            return Response({"error": "Invalid confirmation code."}, status=status.HTTP_400_BAD_REQUEST)


class TrackSearchAPIView(generics.ListAPIView):
    serializer_class = TrackLightSerializer



    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query == '':
            query=None;
        queryset = Track.objects.filter(Q(name__icontains=query))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 10)
        queryset, total_pages = custom_paginate(queryset, int(page), int(page_size))

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total_pages': total_pages,
            'results': serializer.data
        })




class TrackList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]


    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TrackListSerializer
        return TrackCreateSerializer

    def get_queryset(self):
        queryset = Track.objects.all()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Use the custom pagination function
        current_page, total_pages = custom_paginate(queryset, page, page_size)

        serializer = self.get_serializer(current_page, many=True)
        return Response({
            'results': serializer.data,
            'total_pages': total_pages
        })


class AlbumList(PermissionEnforcementMixin,generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AlbumListSerializer
        return AlbumCreateSerializer

    def get_queryset(self):
        queryset = Album.objects.all()

        # Filtering on copy sales
        min_copy_sales = self.request.query_params.get('min_copy_sales')
        if min_copy_sales is not None and min_copy_sales != '':
            queryset = queryset.filter(copy_sales__gte=min_copy_sales)

        # Filtering on name
        query = self.request.query_params.get('q', None)
        if query is not None and query != '':
            queryset = queryset.filter(Q(name__icontains=query))

        return queryset

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))

        # Use the custom pagination function
        current_page, total_pages = custom_paginate(queryset, page, page_size)

        serializer = self.get_serializer(current_page, many=True)
        return Response({
            'results': serializer.data,
            'total_pages': total_pages
        })

class RecordCompanyList(PermissionEnforcementMixin,generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    serializer_class = RecordCompanySerializer

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query == '':
            return RecordCompany.objects.all()
        queryset = RecordCompany.objects.filter(Q(name__icontains=query))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 10)
        queryset, total_pages = custom_paginate(queryset, int(page), int(page_size))

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total_pages': total_pages,
            'results': serializer.data
        })




class RecordCompanyDetail(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    queryset = RecordCompany.objects.all()
    serializer_class = RecordCompanySerializer


class AlbumDetail(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]
   
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer




class TrackDetail(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    queryset = Track.objects.all()
    serializer_class = TrackDetailSerializer


class ArtistList(PermissionEnforcementMixin,generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ArtistListSerializer
        return ArtistCreateSerializer

    def get_queryset(self):
        queryset = Artist.objects.all()

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Use the custom pagination function
        current_page, total_pages = custom_paginate(queryset, page, page_size)

        serializer = self.get_serializer(current_page, many=True)
        return Response({
            'results': serializer.data,
            'total_pages': total_pages
        })  


    
class ArtistDetail(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer


class TrackArtistColabList(PermissionEnforcementMixin,generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    serializer_class = TrackArtistColabDetailSerializer
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TrackArtistColabDetailSerializer
        return TrackArtistColabDetailSerializer

    def get_queryset(self):
        queryset = TrackArtistColab.objects.all()

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Use the custom pagination function
        current_page, total_pages = custom_paginate(queryset, page, page_size)

        serializer = self.get_serializer(current_page, many=True)
        return Response({
            'results': serializer.data,
            'total_pages': total_pages
        })  


class TrackArtistColabDetail(PermissionEnforcementMixin,generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedWithJWT,IsOwnerOrReadOnly]

    serializer_class = TrackArtistColabDetailSerializer
    queryset = TrackArtistColab.objects.all()

class AddTrackToArtist(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedWithJWT]

    serializer_class = TrackArtistColabSerializer

    def get_queryset(self):
        artist_id = self.kwargs['artist_id']
        return TrackArtistColab.objects.filter(artist__id=artist_id)

    def post(self, request, *args, **kwargs):
        artist_id = self.kwargs['artist_id']
        try:
            artist = Artist.objects.get(pk=artist_id)
        except Artist.DoesNotExist:
            return Response({'detail': 'Artist not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TrackArtistColabCreateSerializer(data=request.data)

        if serializer.is_valid():
            track_id = serializer.validated_data['track_id']
            track = Track.objects.get(pk=track_id)
            user= CustomUser.objects.get(pk=request.data['user'])
            track_artist_colab = TrackArtistColab(
                track=track,
                artist=artist,
                collaboration_type=serializer.validated_data['collaboration_type'],
                royalty_percentage=serializer.validated_data['royalty_percentage'],
                user=user,
            )
            track_artist_colab.save()

            response_serializer = TrackArtistColabSerializer(track_artist_colab)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def album_sales_query(request, sales):
    albums = Album.objects.filter(copy_sales__gt=sales)
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)



class ArtistAverageRoyaltyListView(views.APIView):
    def get(self, request, *args, **kwargs):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))

        queryset = Artist.objects.annotate(
            average_royalty=Avg('collaborations__royalty_percentage')
        ).values('name', 'average_royalty')

        paginated_queryset, total_pages = custom_paginate(queryset, page, page_size)

        serializer = ArtistAverageRoyaltySerializer(paginated_queryset, many=True)

        return Response({"total_pages": total_pages, "results": serializer.data})

class RecordCompanyAverageSalesView(views.APIView):
    def get(self, request, *args, **kwargs):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))

        queryset = RecordCompany.objects.annotate(
            avg_sales_per_album=Avg('albums__copy_sales')
        ).values('name', 'avg_sales_per_album')

        paginated_queryset, total_pages = custom_paginate(queryset, page, page_size)

        serializer = RecordCompanyAverageSalesSerializer(paginated_queryset, many=True)

        return Response({"total_pages": total_pages, "results": serializer.data})




class BulkDeleteRecordCompanies(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, *args, **kwargs):
        ids_to_delete = request.data.get('ids', [])
        try:
            RecordCompany.objects.filter(id__in=ids_to_delete).delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"message": "Record Company not found"}, status=status.HTTP_404_NOT_FOUND)


class BulkDeleteAlbums(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, *args, **kwargs):
        ids_to_delete = request.data.get('ids', [])
        try:
            Album.objects.filter(id__in=ids_to_delete).delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"message": "Album not found"}, status=status.HTTP_404_NOT_FOUND)


class BulkDeleteTracks(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, *args, **kwargs):
        ids_to_delete = request.data.get('ids', [])
        try:
            Track.objects.filter(id__in=ids_to_delete).delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"message": "Track not found"}, status=status.HTTP_404_NOT_FOUND)


class BulkDeleteArtists(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, *args, **kwargs):
        ids_to_delete = request.data.get('ids', [])
        try:
            Artist.objects.filter(id__in=ids_to_delete).delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"message": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)


class BulkDeleteTrackArtistColab(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, *args, **kwargs):
        ids_to_delete = request.data.get('ids', [])
        try:
            TrackArtistColab.objects.filter(id__in=ids_to_delete).delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"message": "TrackArtistColab not found"}, status=status.HTTP_404_NOT_FOUND)
        

class ExecuteSQLView(views.APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsAdminUser]

    def post(self, request, format=None):
        raw_query = request.data.get('query')
        with connection.cursor() as cursor:
            cursor.execute(raw_query)
            row = cursor.fetchall()
        return Response(row)