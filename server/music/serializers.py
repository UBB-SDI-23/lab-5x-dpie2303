from rest_framework import serializers

from music.models import RecordCompany, Album, Track, Artist, TrackArtistColab



class ArtistListSerializer(serializers.ModelSerializer):
    collaborations_count = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'name', 'country_of_origin', 'sex', 'description', 'birth_day', 'collaborations_count']



class TrackListSerializer(serializers.ModelSerializer):
    collaborations_count = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ['id', 'name', 'genres', 'description', 'bpm', 'released', 'album', 'collaborations_count']

    def get_collaborations_count(self, obj):
        return obj.collaborations_count

class TrackLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'name', 'released']



class AlbumListSerializer(serializers.ModelSerializer):
    tracks_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'name', 'description', 'top_rank', 'copy_sales', 'release_date', 'record_company', 'tracks_count']

    def get_tracks_count(self, obj):
        return obj.tracks_count


class TrackDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id','name', 'genres', 'description', 'bpm', 'released']


class AlbumDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ['id','name', 'description', 'top_rank', 'copy_sales', 'release_date']




class ArtistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class TrackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class AlbumCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'




class RecordCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordCompany
        fields = '__all__'


class ArtistHighestPaidSerializer(serializers.ModelSerializer):
    total_royalties = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Artist
        fields = ('id', 'name', 'total_royalties')

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'

class TrackDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class ArtistDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'



class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'


class TrackArtistColabSerializer(serializers.ModelSerializer):
    track = TrackDetailSerializer()
    artist = ArtistSerializer()

    class Meta:
        model = TrackArtistColab
        fields = '__all__'


class TrackArtistColabCreateSerializer(serializers.ModelSerializer):
    track_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = TrackArtistColab
        fields = ('track_id', 'collaboration_type', 'royalty_percentage')

class TrackArtistColabDetailSerializer(serializers.ModelSerializer):
    track = TrackDetailSerializer()
    artist = ArtistDetailSerializer()

    class Meta:
        model = TrackArtistColab
        fields = '__all__'

class TrackArtistColabSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackArtistColab
        fields = '__all__'
        
class StatisticsSerializer(serializers.Serializer):
    average_copy_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_genres = serializers.ListField(child=serializers.CharField())
    record_company_sales = serializers.DictField(child=serializers.DecimalField(max_digits=10, decimal_places=2))



class ArtistAverageTracksPerAlbumSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()  # Changed from 'artist_name'
    average_tracks_per_album = serializers.FloatField()

class TrackArtistColabCreateSerializer(serializers.ModelSerializer):
    track_id = serializers.IntegerField()

    class Meta:
        model = TrackArtistColab
        fields = ['track_id', 'collaboration_type', 'royalty_percentage']

    def validate_track_id(self, value):
        try:
            Track.objects.get(pk=value)
            return value
        except Track.DoesNotExist:
            raise serializers.ValidationError("Track not found")
        

class RecordCompanyAverageSalesSerializer(serializers.Serializer):
    record_company_id = serializers.IntegerField()
    record_company_name = serializers.CharField()
    average_sales_per_album = serializers.FloatField()