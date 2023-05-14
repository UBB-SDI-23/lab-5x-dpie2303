from django.db.models import Avg, Q
  
from django.utils.crypto import get_random_string

from rest_framework import generics, views, status, permissions

from rest_framework.decorators import api_view
from rest_framework.response import Response
from music.models import RecordCompany, Album, UserProfile, ConfirmationCode, Track, Artist, TrackArtistColab
from music.serializers import (RecordCompanySerializer, TrackArtistColabCreateSerializer, AlbumSerializer, AlbumDetailSerializer,
                          TrackArtistColab,ArtistCreateSerializer,AlbumCreateSerializer,TrackCreateSerializer,AlbumListSerializer,TrackListSerializer,
                          TrackLightSerializer,ArtistListSerializer, ArtistAverageRoyaltySerializer,
                          RecordCompanyAverageSalesSerializer,ArtistDetailSerializer,
                           TrackArtistColabDetailSerializer , RecordCompanyAverageSalesSerializer,
                          TrackDetailSerializer,UserProfileSerializer, RegisterSerializer, TrackArtistColabSerializer, 
                          TrackArtistColabCreateSerializer,CustomUserSerializer,AdminUserProfileSerializer)

from math import ceil
import logging
from django.db import connection
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


logger = logging.getLogger(__name__)


def custom_paginate(queryset, page, page_size):
    start = (page - 1) * page_size
    end = start + page_size

    # Approximate count
    with connection.cursor() as cursor:
        cursor.execute("SELECT reltuples FROM pg_class WHERE relname = %s", [queryset.model._meta.db_table])
        row = cursor.fetchone()
        if row:
            total_items = int(row[0])
        else:
            total_items = queryset.count()  # Fallback to actual count if no result from above

    total_pages = ceil(total_items / page_size)
    sliced_queryset = queryset[start:end]

    return sliced_queryset, total_pages



class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_admin)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj == request.user


class UserProfileView(views.APIView):
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request,pk=None):
        
        user_profile = UserProfile.objects.get(user_id=pk)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    def put(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CustomUserView(views.APIView):
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request):
        user = CustomUser.objects.get(id=request.user.id)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = CustomUser.objects.get(id=request.user.id)
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = CustomUser.objects.get(id=request.user.id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminUserProfileView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        queryset = UserProfile.objects.all()
        paginated_queryset, total_pages = self.custom_paginate(queryset, page, page_size)
        serializer = AdminUserProfileSerializer(paginated_queryset, many=True)
        return Response({
            'total_pages': total_pages,
            'results': serializer.data
        })

   

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create a confirmation code
            code = get_random_string(length=32)
            ConfirmationCode.objects.create(user=user, code=code, expiry_date=timezone.now()+timedelta(minutes=10))
            # TODO: send email with the confirmation code to the user
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
            'tracks': serializer.data,
            'total_pages': total_pages
        })


class AlbumList(generics.ListCreateAPIView):

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AlbumListSerializer
        return AlbumCreateSerializer

    def get_queryset(self):
        queryset = Album.objects.all()
        min_copy_sales = self.request.query_params.get('min_copy_sales')
        logger.info(f"DEBUGGER {min_copy_sales}")
        if min_copy_sales is not None and min_copy_sales != '':
            queryset = queryset.filter(copy_sales__gte=min_copy_sales)
        return queryset

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))

        # Use the custom pagination function
        current_page, total_pages = custom_paginate(queryset, page, page_size)

        serializer = self.get_serializer(current_page, many=True)
        return Response({
            'albums': serializer.data,
            'total_pages': total_pages
        })

class RecordCompanyList(generics.ListCreateAPIView):
    queryset = RecordCompany.objects.all()
    serializer_class = RecordCompanySerializer


class RecordCompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecordCompany.objects.all()
    serializer_class = RecordCompanySerializer


class AlbumDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer




class TrackDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackDetailSerializer


class ArtistList(generics.ListCreateAPIView):
  
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
            'artists': serializer.data,
            'total_pages': total_pages
        })  


    
class ArtistDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer


class TrackArtistColabList(generics.ListCreateAPIView):
    queryset = TrackArtistColab.objects.all()
    serializer_class = TrackArtistColabSerializer


class TrackArtistColabDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TrackArtistColab.objects.all()
    serializer_class = TrackArtistColabDetailSerializer


class AddTrackToArtist(generics.ListCreateAPIView):
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

            track_artist_colab = TrackArtistColab(
                track=track,
                artist=artist,
                collaboration_type=serializer.validated_data['collaboration_type'],
                royalty_percentage=serializer.validated_data['royalty_percentage']
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