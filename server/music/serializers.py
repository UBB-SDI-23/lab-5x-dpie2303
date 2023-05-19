from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.utils.crypto import get_random_string
from django.contrib.auth.password_validation import validate_password
from music.models import RecordCompany,UserProfile, Album,ConfirmationCode, Track, Artist, TrackArtistColab
from django.contrib.auth import get_user_model


CustomUser = get_user_model()



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'is_regular', 'is_moderator', 'is_admin', 'id']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    albums_count = serializers.SerializerMethodField()
    tracks_count = serializers.SerializerMethodField()
    artists_count = serializers.SerializerMethodField()
    collaborations_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'bio', 'location', 'birth_date', 'gender', 'marital_status', 'albums_count', 'tracks_count', 'artists_count', 'collaborations_count']

    def get_albums_count(self, obj):
        return Album.objects.filter(user=obj.user).count()

    def get_tracks_count(self, obj):
        return Track.objects.filter(user=obj.user).count()

    def get_artists_count(self, obj):
        return Artist.objects.filter(user=obj.user).count()

    def get_collaborations_count(self, obj):
        return TrackArtistColab.objects.filter(user=obj.user).count()

class AdminUserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'location', 'birth_date', 'gender', 'marital_status']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.marital_status = validated_data.get('marital_status', instance.marital_status)
        instance.save()

        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.is_regular = user_data.get('is_regular', user.is_regular)
        user.is_moderator = user_data.get('is_moderator', user.is_moderator)
        user.is_admin = user_data.get('is_admin', user.is_admin)
        user.save()

        return instance
    

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'password2', 'email')
        extra_kwargs = {
            'username': {'validators': [UniqueValidator(queryset=CustomUser.objects.all())]},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        user.set_password(validated_data['password'])
        user.save()
        
        return user


class UserLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']


class ArtistListSerializer(serializers.ModelSerializer):
    user = UserLightSerializer(read_only=True)
    collaborations_count = serializers.SerializerMethodField()


    class Meta:
        model = Artist
        fields = ['user','id', 'name', 'country_of_origin', 'sex', 'description', 'birth_day', 'collaborations_count']

    def get_collaborations_count(self, obj):
        return obj.collaborations.count()

class TrackListSerializer(serializers.ModelSerializer):
    user = UserLightSerializer(read_only=True)
    collaborations_count = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ['user', 'id', 'name', 'genres', 'description', 'bpm', 'released', 'album', 'collaborations_count']

    def get_collaborations_count(self, obj):
        return obj.collaborations.count()
    
class AlbumListSerializer(serializers.ModelSerializer):
    user = UserLightSerializer(read_only=True)
    tracks_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['user', 'id', 'name', 'description', 'top_rank', 'copy_sales', 'release_date', 'record_company', 'tracks_count']
    
    def get_tracks_count(self, obj):
        return obj.tracks.count()

class TrackLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'name', 'released']





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
        fields = ['id', 'name', 'country_of_origin', 'sex', 'description', 'birth_day', 'user']

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
        fields = ('track_id', 'collaboration_type', 'royalty_percentage','user')

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
        
