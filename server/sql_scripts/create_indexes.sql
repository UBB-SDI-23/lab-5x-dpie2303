BEGIN;

-- Create indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;


CREATE INDEX music_recordcompany_name ON music_recordcompany (name);
CREATE INDEX music_recordcompany_name_4d9eaeed ON music_recordcompany (name text_pattern_ops);
CREATE INDEX music_recordcompany_name_4d9eaeed_like ON music_recordcompany USING gin (name gin_trgm_ops);

CREATE INDEX music_album_copy_sales ON music_album (copy_sales);
CREATE INDEX music_album_copy_sales_d02d7ca3 ON music_album (copy_sales);
CREATE INDEX music_album_name ON music_album (name);
CREATE INDEX music_album_name_1f80804d ON music_album (name);
CREATE INDEX music_album_name_1f80804d_like ON music_album USING gin (name gin_trgm_ops);
CREATE INDEX music_album_record_company_id ON music_album (record_company_id);
CREATE INDEX music_album_record_company_id_441dcab6 ON music_album (record_company_id);

CREATE INDEX music_artist_name_ddbd7346 ON music_artist (name);
CREATE INDEX music_artist_name_ddbd7346_like ON music_artist USING gin (name gin_trgm_ops);

CREATE INDEX music_track_album_id ON music_track (album_id);
CREATE INDEX music_track_album_id_f2264d26 ON music_track (album_id);
CREATE INDEX music_track_genres ON music_track (genres);
CREATE INDEX music_track_genres_9eff0193 ON music_track (genres);
CREATE INDEX music_track_genres_9eff0193_like ON music_track USING gin (genres gin_trgm_ops);
CREATE INDEX music_track_name ON music_track (name);
CREATE INDEX music_track_name_5648f155 ON music_track (name);
CREATE INDEX music_track_name_5648f155_like ON music_track USING gin (name gin_trgm_ops);

CREATE INDEX music_trackartistcolab_artist_id ON music_trackartistcolab (artist_id);
CREATE INDEX music_trackartistcolab_artist_id_f913e6b0 ON music_trackartistcolab (artist_id);
CREATE INDEX music_trackartistcolab_track_id_b773040b ON music_trackartistcolab (track_id);

-- Create foreign key constraints
-- ALTER TABLE music_album ADD CONSTRAINT music_album_record_company_id_fkey FOREIGN KEY (record_company_id) REFERENCES music_recordcompany(id);
-- ALTER TABLE music_track ADD CONSTRAINT music_track_album_id_fkey FOREIGN KEY (album_id) REFERENCES music_album(id);
-- ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES music_artist(id);
-- ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_track_id_fkey FOREIGN KEY (track_id) REFERENCES music_track(id);

COMMIT;