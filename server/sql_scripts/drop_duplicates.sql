BEGIN;

DELETE FROM music_trackartistcolab
WHERE (track_id, artist_id) IN (
    SELECT track_id, artist_id
    FROM music_trackartistcolab
    GROUP BY track_id, artist_id
    HAVING COUNT(*) > 1
);

COMMIT;