from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import F

class RecordCompany(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    founded_date = models.DateField()
    headquarters_location = models.CharField(max_length=255)
    contact_email = models.EmailField()
    albums_count = models.PositiveIntegerField(default=0)


class Album(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    description = models.CharField(max_length=255)
    top_rank = models.IntegerField()
    copy_sales = models.IntegerField(db_index=True) # Add index
    release_date = models.DateField()
    record_company = models.ForeignKey(RecordCompany, on_delete=models.CASCADE, related_name='albums', db_index=True) # Add index
    tracks_count = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            RecordCompany.objects.filter(id=self.record_company_id).update(albums_count=F('albums_count') + 1)
            
    def delete(self, *args, **kwargs):
        RecordCompany.objects.filter(id=self.record_company_id).update(albums_count=F('albums_count') - 1)
        super().delete(*args, **kwargs)

    def clean(self):
        if self.copy_sales < 0:
            raise ValidationError("Copy sales must be a non-negative integer.")



class Track(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    genres = models.CharField(max_length=255, db_index=True) # Add index
    description = models.CharField(max_length=255)
    bpm = models.IntegerField()
    released = models.IntegerField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks', db_index=True) # Add index
    collaborations_count = models.PositiveIntegerField(default=0)


    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            Album.objects.filter(id=self.album_id).update(tracks_count=F('tracks_count') + 1)

    def delete(self, *args, **kwargs):
        Album.objects.filter(id=self.album_id).update(tracks_count=F('tracks_count') - 1)
        super().delete(*args, **kwargs)

    def clean(self):
        from datetime import datetime
        current_year = datetime.now().year
        if self.released > current_year:
            raise ValidationError("The released year cannot be in the future.")
        if self.bpm < 0:
            raise ValidationError("BPM must be a non-negative integer.")

        


class Artist(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    country_of_origin = models.CharField(max_length=255, null=True)
    sex = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    birth_day = models.DateField()
    collaborations_count = models.PositiveIntegerField(default=0)


    def clean(self):
        from datetime import date
        if self.birth_day > date.today():
            raise ValidationError("The birth day cannot be in the future.")


class TrackArtistColab(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    collaboration_type = models.CharField(max_length=255)
    royalty_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            Track.objects.filter(id=self.track_id).update(collaborations_count=F('collaborations_count') + 1)
            Artist.objects.filter(id=self.artist_id).update(collaborations_count=F('collaborations_count') + 1)
            
    def delete(self, *args, **kwargs):
        Track.objects.filter(id=self.track_id).update(collaborations_count=F('collaborations_count') - 1)
        Artist.objects.filter(id=self.artist_id).update(collaborations_count=F('collaborations_count') - 1)
        super().delete(*args, **kwargs)


    def clean(self):
        if self.royalty_percentage < 0:
            raise ValidationError("Royalty percentage must be a non-negative decimal.")

        if self.royalty_percentage > 100:
            raise ValidationError("Royalty percentage must not be greater than 100.")
