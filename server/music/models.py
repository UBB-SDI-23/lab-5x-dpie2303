from django.db import models
from rest_framework import serializers

class RecordCompany(models.Model):
    name = models.CharField(max_length=255)
    founded_date = models.DateField()
    headquarters_location = models.CharField(max_length=255)
    contact_email = models.EmailField()

    def __str__(self):
        return self.name

class Album(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    top_rank = models.IntegerField()
    copy_sales = models.IntegerField()
    release_date = models.DateField()
    record_company = models.ForeignKey(RecordCompany, on_delete=models.CASCADE, related_name='albums')

    def __str__(self):
        return self.name

class Track(models.Model):
    name = models.CharField(max_length=255)
    genres = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    bpm = models.IntegerField()
    released = models.IntegerField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks')

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=255)
    contry_of_origin = models.CharField(max_length=255)
    sex = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    birth_day = models.DateField()

    def __str__(self):
        return self.name


class TrackArtistColab(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='collaborations')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='collaborations')
    collaboration_type = models.CharField(max_length=255)
    royalty_percentage = models.DecimalField(max_digits=5, decimal_places=2)

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