BEGIN;

-- Create a sequence
CREATE SEQUENCE temp_seq START 1;

-- Add a temporary column to the table for numbering rows
ALTER TABLE music_trackartistcolab ADD COLUMN temp_id INTEGER;

-- Update the new column with sequence numbers
UPDATE music_trackartistcolab SET temp_id = NEXTVAL('temp_seq');

-- Create the new table with unique rows
CREATE TABLE music_trackartistcolab_temp AS 
SELECT *
FROM music_trackartistcolab
WHERE temp_id IN (
    SELECT MIN(temp_id)
    FROM music_trackartistcolab
    GROUP BY track_id, artist_id
);

-- Drop the temporary column and sequence
ALTER TABLE music_trackartistcolab DROP COLUMN temp_id;
ALTER TABLE music_trackartistcolab_temp DROP COLUMN temp_id;
DROP SEQUENCE temp_seq;

-- Rename the original table (backup purpose)
ALTER TABLE music_trackartistcolab RENAME TO music_trackartistcolab_backup;

-- Rename the temporary table to the original name
ALTER TABLE music_trackartistcolab_temp RENAME TO music_trackartistcolab;

ALTER TABLE music_trackartistcolab ADD COLUMN id bigserial PRIMARY KEY;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_artist_id_f913e6b0_fk_music_artist_id FOREIGN KEY (artist_id) REFERENCES music_artist (id) ON DELETE CASCADE;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_track_id_b773040b_fk_music_track_id FOREIGN KEY (track_id) REFERENCES music_track (id) ON DELETE CASCADE;


COMMIT;