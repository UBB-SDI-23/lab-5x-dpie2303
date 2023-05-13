BEGIN;
WITH album_tracks AS (
    SELECT album_id, COUNT(*) as track_count
    FROM music_track
    GROUP BY album_id
)
UPDATE music_album 
SET tracks_count = album_tracks.track_count
FROM album_tracks
WHERE music_album.id = album_tracks.album_id;
COMMIT;
BEGIN;
WITH artist_collaborations AS (
    SELECT artist_id, COUNT(*) as collaboration_count
    FROM music_trackartistcolab
    GROUP BY artist_id
)
UPDATE music_artist 
SET collaborations_count = artist_collaborations.collaboration_count
FROM artist_collaborations
WHERE music_artist.id = artist_collaborations.artist_id;
COMMIT;
BEGIN;
WITH record_company_albums AS (
    SELECT record_company_id, COUNT(*) as album_count
    FROM music_album
    GROUP BY record_company_id
)
UPDATE music_recordcompany 
SET albums_count = record_company_albums.album_count
FROM record_company_albums
WHERE music_recordcompany.id = record_company_albums.record_company_id;
COMMIT;
BEGIN;
WITH track_collaborations AS (
    SELECT track_id, COUNT(*) as collaboration_count
    FROM music_trackartistcolab
    GROUP BY track_id
)
UPDATE music_track
SET collaborations_count = track_collaborations.collaboration_count
FROM track_collaborations
WHERE music_track.id = track_collaborations.track_id;
COMMIT;
