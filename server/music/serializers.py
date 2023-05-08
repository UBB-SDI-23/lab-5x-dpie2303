from rest_framework import serializers

from music.models import RecordCompany, Album, Track, Artist, TrackArtistColab


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

class AlbumDetailSerializer(serializers.ModelSerializer):
    record_company = RecordCompanySerializer()

    class Meta:
        model = Album
        fields = '__all__'


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'


class TrackDetailSerializer(serializers.ModelSerializer):
    album = AlbumDetailSerializer()

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
    artist_id = serializers.IntegerField()
    artist_name = serializers.CharField()
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