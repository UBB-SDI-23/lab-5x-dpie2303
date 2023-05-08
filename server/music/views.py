from django.db.models import Avg,F, Count, OuterRef, Subquery, Q, Case, When, \
    IntegerField, Exists, Sum, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce, Cast
from collections import Counter
from rest_framework import generics
from rest_framework import status

from rest_framework.decorators import api_view
from rest_framework.response import Response
from music.models import RecordCompany, Album, Track, Artist, TrackArtistColab
from music.serializers import (RecordCompanySerializer,ArtistHighestPaidSerializer,StatisticsSerializer, TrackArtistColabCreateSerializer, AlbumSerializer, AlbumDetailSerializer,
                          TrackSerializer,ArtistDetailSerializer,ArtistAverageTracksPerAlbumSerializer, TrackArtistColabDetailSerializer , TrackDetailSerializer, ArtistSerializer, TrackArtistColabSerializer, TrackArtistColabCreateSerializer)


class RecordCompanyList(generics.ListCreateAPIView):
    queryset = RecordCompany.objects.all()
    serializer_class = RecordCompanySerializer


class RecordCompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecordCompany.objects.all()
    serializer_class = RecordCompanySerializer


class AlbumList(generics.ListCreateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class AlbumDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer


class TrackList(generics.ListCreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer


class TrackDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackDetailSerializer


class ArtistList(generics.ListCreateAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


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



class HighestPaidArtist(generics.ListAPIView):
    royalties_expression = ExpressionWrapper(
        Cast(Coalesce('collaborations__royalty_percentage', 0), DecimalField()) *
        Cast(Coalesce('collaborations__track__album__copy_sales', 0), DecimalField()),
        output_field=DecimalField()
    )

    queryset = Artist.objects.annotate(
        total_royalties=Sum(royalties_expression)
    ).order_by('-total_royalties')

    serializer_class = ArtistHighestPaidSerializer

class MultipleStatistics(generics.ListCreateAPIView): # ListCreateAPIView GenericAPIView
    serializer_class = StatisticsSerializer

    def get(self, request):
        average_copy_sales = Album.objects.aggregate(avg_copy_sales=Avg('copy_sales'))['avg_copy_sales']
        top_genres = Track.objects.values_list('genres', flat=True)
        top_genres = [genre for genre_list in top_genres for genre in genre_list.split(',')]
        top_genres = [item[0] for item in Counter(top_genres).most_common(3)]

        record_companies = RecordCompany.objects.all()
        record_company_sales = {
            record_company.name: record_company.albums.aggregate(
                total_sales=Sum('copy_sales')
            )['total_sales']
            for record_company in record_companies
        }

        stats = {
            'average_copy_sales': average_copy_sales,
            'top_genres': top_genres,
            'record_company_sales': record_company_sales
        }

        serializer = StatisticsSerializer(stats)
        return Response(serializer.data)



class ArtistAverageTracksPerAlbumReportView(generics.ListAPIView):
    serializer_class = ArtistAverageTracksPerAlbumSerializer

    def get_queryset(self):
        return Artist.objects.annotate(
            album_count=Count('collaborations__track__album', distinct=True),
            track_count=Count('collaborations__track', distinct=True),
        ).annotate(
            average_tracks_per_album=(1.0 * F('track_count')) / F('album_count')
        ).order_by('-average_tracks_per_album')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for artist in queryset:
            data.append({
                'artist_id': artist.id,
                'artist_name': artist.name,
                'average_tracks_per_album': artist.average_tracks_per_album
            })
        return Response(data)

