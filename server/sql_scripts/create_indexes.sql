BEGIN;
-- Add constraints
ALTER TABLE music_userprofile ADD CONSTRAINT music_userprofile_user_id_5531150c_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_confirmationcode ADD CONSTRAINT music_confirmationco_user_id_d9b284ea_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_track ADD CONSTRAINT music_track_user_id_396b3280_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_track ADD CONSTRAINT music_track_album_id_f2264d26_fk_music_album_id FOREIGN KEY (album_id) REFERENCES music_album(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcol_user_id_89084bf6_fk_accounts_ FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_track_id_b773040b_fk_music_track_id FOREIGN KEY (track_id) REFERENCES music_track(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_trackartistcolab ADD CONSTRAINT music_trackartistcolab_artist_id_f913e6b0_fk_music_artist_id FOREIGN KEY (artist_id) REFERENCES music_artist(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_album ADD CONSTRAINT music_album_user_id_5762717f_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_album ADD CONSTRAINT music_album_record_company_id_441dcab6_fk_music_rec FOREIGN KEY (record_company_id) REFERENCES music_recordcompany(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_recordcompany ADD CONSTRAINT music_recordcompany_user_id_0d9ed0b0_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE music_artist ADD CONSTRAINT music_artist_user_id_b0d56609_fk_accounts_customuser_id FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) DEFERRABLE INITIALLY DEFERRED;

-- Continue with the creation of non-primary key indexes
CREATE INDEX music_album_copy_sales_d02d7ca3 ON music_album USING btree (copy_sales);
CREATE INDEX music_album_name_1f80804d ON music_album USING btree (name);
CREATE INDEX music_album_name_1f80804d_like ON music_album USING btree (name varchar_pattern_ops);
CREATE INDEX music_artist_name_ddbd7346 ON music_artist USING btree (name);
CREATE INDEX music_artist_name_ddbd7346_like ON music_artist USING btree (name varchar_pattern_ops);
CREATE INDEX music_recordcompany_name_4d9eaeed ON music_recordcompany USING btree (name);
CREATE INDEX music_recordcompany_name_4d9eaeed_like ON music_recordcompany USING btree (name varchar_pattern_ops);
CREATE INDEX music_track_genres_9eff0193 ON music_track USING btree (genres);
CREATE INDEX music_track_genres_9eff0193_like ON music_track USING btree (genres varchar_pattern_ops);
CREATE INDEX music_track_name_5648f155 ON music_track USING btree (name);
CREATE INDEX music_track_name_5648f155_like ON music_track USING btree (name varchar_pattern_ops);
CREATE INDEX music_album_user_id_5762717f ON music_album USING btree (user_id);
CREATE INDEX music_artist_user_id_b0d56609 ON music_artist USING btree (user_id);
CREATE INDEX music_recordcompany_user_id_0d9ed0b0 ON music_recordcompany USING btree (user_id);
CREATE INDEX music_track_user_id_396b3280 ON music_track USING btree (user_id);
CREATE INDEX music_trackartistcolab_user_id_89084bf6 ON music_trackartistcolab USING btree (user_id);
CREATE UNIQUE INDEX music_userprofile_user_id_key ON music_userprofile USING btree (user_id);
CREATE INDEX music_track_album_id_f2264d26 ON public.music_track USING btree (album_id);
CREATE INDEX music_trackartistcolab_artist_id_f913e6b0 ON public.music_trackartistcolab USING btree (artist_id);
CREATE INDEX music_trackartistcolab_track_id_b773040b ON public.music_trackartistcolab USING btree (track_id);
CREATE INDEX music_album_record_company_id_441dcab6 ON public.music_album USING btree (record_company_id);
COMMIT;