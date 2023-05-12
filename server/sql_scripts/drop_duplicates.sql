BEGIN;

WITH duplicates AS (
    SELECT track_id, artist_id, 
    ROW_NUMBER() OVER(PARTITION BY track_id, artist_id ORDER BY track_id, artist_id) AS row_num
    FROM music_trackartistcolab
)
DELETE FROM duplicates WHERE row_num > 1;

COMMIT;