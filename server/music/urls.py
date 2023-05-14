from django.urls import path
from music.views import (
    RecordCompanyList, 
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
    RecordCompanyAverageSalesView,
    TrackSearchAPIView,
    ArtistAverageRoyaltyListView,
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
    path('record_company_average_sales/', RecordCompanyAverageSalesView.as_view(), name='record_company_average_sales_report'),
    path('tracks/search/', TrackSearchAPIView.as_view(), name='track_search'),
    path('artist_average_royalty/', ArtistAverageRoyaltyListView.as_view(), name='artist_average_royalty_list_report'),
]
