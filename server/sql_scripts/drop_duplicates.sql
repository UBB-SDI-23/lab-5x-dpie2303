BEGIN;
CREATE TABLE music_trackartistcolab_temp AS 
SELECT DISTINCT ON (track_id, artist_id) *
FROM music_trackartistcolab;

DROP TABLE music_trackartistcolab;
ALTER TABLE music_trackartistcolab_temp RENAME TO music_trackartistcolab; 

ALTER TABLE music_trackartistcolab DROP COLUMN id;
ALTER TABLE music_trackartistcolab ADD COLUMN id bigserial PRIMARY KEY;
CREATE INDEX music_trackartistcolab_artist_id_f913e6b0 ON public.music_trackartistcolab USING btree (artist_id);
CREATE INDEX music_trackartistcolab_track_id_b773040b ON public.music_trackartistcolab USING btree (track_id);
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_artist_id_f913e6b0_fk_music_artist_id FOREIGN KEY (artist_id) REFERENCES music_artist(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_track_id_b773040b_fk_music_track_id FOREIGN KEY (track_id) REFERENCES music_track(id) DEFERRABLE INITIALLY DEFERRED;
COMMIT;