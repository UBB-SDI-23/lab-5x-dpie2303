-- sql_scripts/drop_indexes.sql
BEGIN;

-- RecordCompany
DROP INDEX IF EXISTS music_recordcompany_name;

-- Album
DROP INDEX IF EXISTS music_album_name;
DROP INDEX IF EXISTS music_album_copy_sales;
DROP INDEX IF EXISTS music_album_record_company_id;

-- Track
DROP INDEX IF EXISTS music_track_name;
DROP INDEX IF EXISTS music_track_genres;
DROP INDEX IF EXISTS music_track_album_id;

-- TrackArtistColab
DROP INDEX IF EXISTS music_trackartistcolab_track_id;
DROP INDEX IF EXISTS music_trackartistcolab_artist_id;

COMMIT;