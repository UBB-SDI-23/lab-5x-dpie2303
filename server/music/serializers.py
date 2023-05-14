from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from music.models import RecordCompany, Album, Track, Artist, TrackArtistColab


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user




class ArtistListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = ['id', 'name', 'country_of_origin', 'sex', 'description', 'birth_day', 'collaborations_count']



class TrackListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Track
        fields = ['id', 'name', 'genres', 'description', 'bpm', 'released', 'album', 'collaborations_count']


class TrackLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'name', 'released']



class AlbumListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ['id', 'name', 'description', 'top_rank', 'copy_sales', 'release_date', 'record_company', 'tracks_count']



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
        fields = ['id', 'name', 'country_of_origin', 'sex', 'description', 'birth_day']

class TrackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class AlbumCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class RecordCompanyAverageSalesSerializer(serializers.Serializer):
    name = serializers.CharField()
    avg_sales_per_album = serializers.FloatField()


class ArtistAverageRoyaltySerializer(serializers.Serializer):
    name = serializers.CharField()
    average_royalty = serializers.FloatField()



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
        
