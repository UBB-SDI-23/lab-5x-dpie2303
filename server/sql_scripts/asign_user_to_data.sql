BEGIN;
-- UPDATE music_album SET user_id = FLOOR(RANDOM() * 10000);
-- UPDATE music_artist SET user_id = FLOOR(RANDOM() * 10000);
-- UPDATE music_recordcompany SET user_id = FLOOR(RANDOM() * 10000);



ALTER TABLE music_trackartistcolab DROP CONSTRAINT IF EXISTS music_trackartistcol_user_id_89084bf6_fk_accounts_;
ALTER TABLE music_track DROP CONSTRAINT IF EXISTS music_track_user_id_396b3280_fk_accounts_customuser_id;
DROP INDEX IF EXISTS music_track_user_id_396b3280;
DROP INDEX IF EXISTS music_trackartistcolab_user_id_89084bf6;



UPDATE music_track SET user_id = FLOOR(RANDOM() * 10000);
UPDATE music_trackartistcolab SET user_id = FLOOR(RANDOM() * 10000);


ALTER TABLE music_track
ADD CONSTRAINT music_track_user_id_396b3280_fk_accounts_customuser_id
FOREIGN KEY (user_id) REFERENCES accounts_customuser(id);

ALTER TABLE music_trackartistcolab
ADD CONSTRAINT music_trackartistcol_user_id_89084bf6_fk_accounts_
FOREIGN KEY (user_id) REFERENCES accounts_customuser(id);

COMMIT