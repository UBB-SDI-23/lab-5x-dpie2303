BEGIN;
UPDATE music_album
SET tracks_count = (
    SELECT COUNT(*)
    FROM music_track
    WHERE music_track.album_id = music_album.id
)
COMMIT;

BEGIN;

UPDATE music_artist
SET collaborations_count = (
    SELECT COUNT(*)
    FROM music_trackartistcolab
    WHERE music_trackartistcolab.artist_id = music_artist.id
)

COMMIT;

BEGIN;

UPDATE music_recordcompany
SET albums_count = (
    SELECT COUNT(*)
    FROM music_album
    WHERE music_album.record_company_id = music_recordcompany.id
)

COMMIT;


BEGIN;

UPDATE music_track
SET collaborations_count = (
    SELECT COUNT(*)
    FROM music_trackartistcolab
    WHERE music_trackartistcolab.track_id = music_track.id
)

COMMIT;