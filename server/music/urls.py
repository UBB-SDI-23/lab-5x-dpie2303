from django.urls import path
from music.views import (
    RecordCompanyList, 
    HighestPaidArtist, 
    MultipleStatistics,
    RecordCompanyDetail,
    AlbumList,
    AlbumDetail,
    TrackList,
    TrackDetail,
    ArtistList,
    ArtistDetail,
    AddTrackToArtist,
    TrackArtistColabList,
    TrackArtistColabDetail,
    album_sales_query,
    ArtistAverageTracksPerAlbumReportView
)

urlpatterns = [
    path('record_companies/', RecordCompanyList.as_view()),
    path('record_companies/<int:pk>/', RecordCompanyDetail.as_view()),
    path('albums/', AlbumList.as_view()),
    path('albums/<int:pk>/', AlbumDetail.as_view()),
    path('tracks/', TrackList.as_view()),
    path('tracks/<int:pk>/', TrackDetail.as_view()),
    path('trackartistcolab/', TrackArtistColabList.as_view()),
    path('trackartistcolab/<int:pk>/', TrackArtistColabDetail.as_view()),
    path('artists/', ArtistList.as_view()),
    path('artists/<int:pk>/', ArtistDetail.as_view()),
    path('artists/<int:artist_id>/tracks/', AddTrackToArtist.as_view(), name='add_track_to_artist'),
    path('albums/sales_query/<int:sales>/', album_sales_query),
    path('highest_paid_artist/', HighestPaidArtist.as_view(), name='highest_paid_artist'),
    path('multiple_statistics/', MultipleStatistics.as_view(), name='multiple_statistics'),
    path('artist_average_tracks_per_album/', ArtistAverageTracksPerAlbumReportView.as_view(), name='artist_average_tracks_per_album_report'),
]