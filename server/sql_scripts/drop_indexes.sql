BEGIN;

-- Drop indexes
DROP INDEX IF EXISTS music_recordcompany_name;
DROP INDEX IF EXISTS music_recordcompany_name_4d9eaeed;
DROP INDEX IF EXISTS music_recordcompany_name_4d9eaeed_like;

DROP INDEX IF EXISTS music_album_copy_sales;
DROP INDEX IF EXISTS music_album_copy_sales_d02d7ca3;
DROP INDEX IF EXISTS music_album_name;
DROP INDEX IF EXISTS music_album_name_1f80804d;
DROP INDEX IF EXISTS music_album_name_1f80804d_like;
DROP INDEX IF EXISTS music_album_record_company_id;
DROP INDEX IF EXISTS music_album_record_company_id_441dcab6;

DROP INDEX IF EXISTS music_artist_name_ddbd7346;
DROP INDEX IF EXISTS music_artist_name_ddbd7346_like;

DROP INDEX IF EXISTS music_track_album_id;
DROP INDEX IF EXISTS music_track_album_id_f2264d26;
DROP INDEX IF EXISTS music_track_genres;
DROP INDEX IF EXISTS music_track_genres_9eff0193;
DROP INDEX IF EXISTS music_track_genres_9eff0193_like;
DROP INDEX IF EXISTS music_track_name;
DROP INDEX IF EXISTS music_track_name_5648f155;
DROP INDEX IF EXISTS music_track_name_5648f155_like;

DROP INDEX IF EXISTS music_trackartistcolab_artist_id;
DROP INDEX IF EXISTS music_trackartistcolab_artist_id_f913e6b0;
DROP INDEX IF EXISTS music_trackartistcolab_track_id_b773040b;



-- Drop foreign key constraints
ALTER TABLE music_album DROP CONSTRAINT IF EXISTS music_album_record_company_id_441dcab6_fk_music_rec;
ALTER TABLE music_track DROP CONSTRAINT IF EXISTS music_track_album_id_f2264d26_fk_music_album_id;
ALTER TABLE music_trackartistcolab DROP CONSTRAINT IF EXISTS music_trackartistcolab_artist_id_f913e6b0_fk_music_artist_id;
ALTER TABLE music_trackartistcolab DROP CONSTRAINT IF EXISTS music_trackartistcolab_track_id_b773040b_fk_music_track_id;


-- Drop primary key constraints
ALTER TABLE music_album DROP CONSTRAINT IF EXISTS music_album_pkey;
ALTER TABLE music_album DROP COLUMN id;
ALTER TABLE music_artist DROP CONSTRAINT IF EXISTS music_artist_pkey;
ALTER TABLE music_artist DROP COLUMN id;
ALTER TABLE music_recordcompany DROP CONSTRAINT IF EXISTS music_recordcompany_pkey;
ALTER TABLE music_recordcompany DROP COLUMN id;
ALTER TABLE music_track DROP CONSTRAINT IF EXISTS music_track_pkey;
ALTER TABLE music_track DROP COLUMN id;
ALTER TABLE music_trackartistcolab DROP CONSTRAINT IF EXISTS music_trackartistcolab_pkey;
ALTER TABLE music_trackartistcolab DROP COLUMN id;


COMMIT;