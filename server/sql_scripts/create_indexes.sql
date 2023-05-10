BEGIN;

-- RecordCompany
CREATE INDEX music_recordcompany_name ON music_recordcompany (name);

-- Album
CREATE INDEX music_album_name ON music_album (name);
CREATE INDEX music_album_copy_sales ON music_album (copy_sales);
CREATE INDEX music_album_record_company_id ON music_album (record_company_id);

-- Track
CREATE INDEX music_track_name ON music_track (name);
CREATE INDEX music_track_genres ON music_track (genres);
CREATE INDEX music_track_album_id ON music_track (album_id);

-- TrackArtistColab
CREATE INDEX music_trackartistcolab_track_id ON music_trackartistcolab (track_id);
CREATE INDEX music_trackartistcolab_artist_id ON music_trackartistcolab (artist_id);

COMMIT;