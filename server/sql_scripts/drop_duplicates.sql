BEGIN;

-- Step 1: Create a new temporary table with unique rows
CREATE TABLE music_trackartistcolab_temp AS 
SELECT DISTINCT track_id, artist_id
FROM music_trackartistcolab;

-- Step 2: Rename the original table (backup purpose)
ALTER TABLE music_trackartistcolab RENAME TO music_trackartistcolab_backup;

-- Step 3: Rename the temporary table to the original name
ALTER TABLE music_trackartistcolab_temp RENAME TO music_trackartistcolab;

COMMIT;