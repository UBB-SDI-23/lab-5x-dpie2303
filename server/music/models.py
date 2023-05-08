from django.db import models

class RecordCompany(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    founded_date = models.DateField()
    headquarters_location = models.CharField(max_length=255)
    contact_email = models.EmailField()

class Album(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    description = models.CharField(max_length=255)
    top_rank = models.IntegerField()
    copy_sales = models.IntegerField(db_index=True) # Add index
    release_date = models.DateField()
    record_company = models.ForeignKey(RecordCompany, on_delete=models.CASCADE, related_name='albums', db_index=True) # Add index

class Track(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    genres = models.CharField(max_length=255, db_index=True) # Add index
    description = models.CharField(max_length=255)
    bpm = models.IntegerField()
    released = models.IntegerField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks', db_index=True) # Add index

class Artist(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    country_of_origin = models.CharField(max_length=255, null=True)
    sex = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    birth_day = models.DateField()

class TrackArtistColab(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    collaboration_type = models.CharField(max_length=255)
    royalty_percentage = models.DecimalField(max_digits=5, decimal_places=2)