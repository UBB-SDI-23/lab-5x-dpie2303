BEGIN;
UPDATE music_album SET user_id = FLOOR(RANDOM() * 10000);
UPDATE music_artist SET user_id = FLOOR(RANDOM() * 10000);
UPDATE music_recordcompany SET user_id = FLOOR(RANDOM() * 10000);
UPDATE music_track SET user_id = FLOOR(RANDOM() * 10000);
UPDATE music_trackartistcolab SET user_id = FLOOR(RANDOM() * 10000);
COMMIT