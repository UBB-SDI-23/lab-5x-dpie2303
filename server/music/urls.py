from django.urls import path
from rest_framework_simplejwt import views as jwt_views

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
    RegisterView,
    ConfirmRegistrationView,
    AdminUserListEditor,
    AdminUserEditor,
    UserProfileView,
    UserSearchView,
    BulkDeleteRecordCompanies,
    BulkDeleteAlbums,
    BulkDeleteTracks,
    BulkDeleteArtists,
    BulkDeleteTrackArtistColab,
    ExecuteSQLView,
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
    path('register/', RegisterView.as_view(), name='register'),
    path('register/confirm/<str:confirmation_code>/', ConfirmRegistrationView.as_view(), name='confirm_registration'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/profiles/', AdminUserListEditor.as_view(), name='admin_profiles'),
    path('admin/profiles/<int:pk>/', AdminUserEditor.as_view(), name='admin_profile'),
    path('profile/<int:pk>/', UserProfileView.as_view(), name='user_profile'),
    path('user/<str:query>/', UserSearchView.as_view(), name='user_search'),
    path('admin/bulk_delete/record_companies/', BulkDeleteRecordCompanies.as_view()),
    path('admin/bulk_delete/albums/', BulkDeleteAlbums.as_view()),
    path('admin/bulk_delete/tracks/', BulkDeleteTracks.as_view()),
    path('admin/bulk_delete/artists/', BulkDeleteArtists.as_view()),
    path('admin/bulk_delete/trackartistcolab/', BulkDeleteTrackArtistColab.as_view()),
    path('admin/execute_sql/', ExecuteSQLView.as_view()),
    
]
