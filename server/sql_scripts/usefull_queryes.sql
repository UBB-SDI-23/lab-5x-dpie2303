--get indexes
SELECT 
    t.relname AS table_name, 
    i.relname AS index_name,
    a.attname AS column_name,
    CASE
        WHEN ix.indisprimary THEN 'PRIMARY KEY'
        WHEN ix.indisunique THEN 'UNIQUE'
        ELSE 'INDEX'
    END AS index_type
FROM 
    pg_class t, 
    pg_class i, 
    pg_index ix, 
    pg_attribute a
WHERE 
    t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid 
    AND a.attnum = ANY(ix.indkey)
    AND t.relkind = 'r'
    AND t.relname LIKE 'music%'
ORDER BY 
    t.relname, 
    i.relname;

--get foreign keys

SELECT
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    af.attname AS foreign_column_name
FROM 
    pg_attribute a 
JOIN 
    pg_constraint con ON con.conrelid = a.attrelid AND a.attnum = ANY(con.conkey)
JOIN 
    pg_attribute af ON af.attnum = ANY(con.confkey) AND af.attrelid = con.confrelid
WHERE 
    con.contype = 'f'
    AND conrelid::regclass::text LIKE 'music%';

psql -h localhost -p 5432 -U dobo_admin -d music_db
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/tracks.sql

psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/track_artist_colab.sql
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/create_indexes.sql
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/drop_duplicates.sql

psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/create_count_colum.sql


week 9. log in users should be able to add conf to see how many itmes they can see on page.

psql -h localhost -p 5432 -U dobo_admin -d music_db -c "SELECT COUNT(*) FROM music_trackartistcolab;"
psql -h localhost -p 5432 -U dobo_admin -d music_db -c "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name LIKE 'music%';"

psql -h localhost -p 5432 -U dobo_admin -d music_db -c  "SELECT * FROM pg_stat_activity WHERE state = 'active';"
SELECT * FROM pg_stat_activity;


            #   python manage.py non_interactive_makemigrations &&
            #   python manage.py migrate &&
            # #  python manage.py populate_db &&
            #   python manage.py collectstatic --no-input --clear &&
            # #  gunicorn -b 0.0.0.0:8000 music_library.wsgi &&
            #   python manage.py runserver 0.0.0.0:8000"


            --clear 

from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import F
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from datetime import date


# Your Custom User model
class CustomUser(AbstractUser):
    is_moderator = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True, max_length=500)
    location = models.CharField(max_length=50, blank=True,null=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True,null=True)

    MARITAL_STATUS_CHOICES = [
        ('S', 'Single'),
        ('M', 'Married'),
        ('D', 'Divorced'),
        ('W', 'Widowed'),
    ]

    marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS_CHOICES, blank=True)

    def clean(self):
        # Bio length validation
        if len(self.bio) > 500:
            raise ValidationError("Bio cannot be more than 500 characters.")
        
        # Birth date validation
        if self.birth_date and self.birth_date > date.today():
            raise ValidationError("Birth date cannot be in the future.")
        
        # Marital status validation
        if self.marital_status not in [choice[0] for choice in self.MARITAL_STATUS_CHOICES]:
            raise ValidationError("Invalid marital status.")

class RecordCompany(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    founded_date = models.DateField()
    headquarters_location = models.CharField(max_length=255)
    contact_email = models.EmailField()
    albums_count = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)



class Album(models.Model):
    name = models.CharField(max_length=255, db_index=True) # Add index
    description = models.CharField(max_length=255)
    top_rank = models.IntegerField()
    copy_sales = models.IntegerField(db_index=True) # Add index
    release_date = models.DateField()
    record_company = models.ForeignKey(RecordCompany, on_delete=models.CASCADE, related_name='albums', db_index=True) # Add index
    tracks_count = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
   

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)


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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)


    def clean(self):
        from datetime import date
        if self.birth_day > date.today():
            raise ValidationError("The birth day cannot be in the future.")


class TrackArtistColab(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='collaborations', db_index=True) # Add index
    collaboration_type = models.CharField(max_length=255)
    royalty_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    

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
