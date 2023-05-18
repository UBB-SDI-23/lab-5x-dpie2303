--get indexes
SELECT 
    t.relname AS table_name, 
    i.relname AS index_name,
    a.attname AS column_name,
    CASE
        WHEN ix.indisprimary THEN 'PRIMARY KEY'
        WHEN ix.indisunique THEN 'UNIQUE'
        ELSE 'INDEX'
    END AS index_type
FROM 
    pg_class t, 
    pg_class i, 
    pg_index ix, 
    pg_attribute a
WHERE 
    t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid 
    AND a.attnum = ANY(ix.indkey)
    AND t.relkind = 'r'
    AND t.relname LIKE 'music%'
ORDER BY 
    t.relname, 
    i.relname;

--get foreign keys

SELECT
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    af.attname AS foreign_column_name
FROM 
    pg_attribute a 
JOIN 
    pg_constraint con ON con.conrelid = a.attrelid AND a.attnum = ANY(con.conkey)
JOIN 
    pg_attribute af ON af.attnum = ANY(con.confkey) AND af.attrelid = con.confrelid
WHERE 
    con.contype = 'f'
    AND conrelid::regclass::text LIKE 'music%';

psql -h localhost -p 5432 -U dobo_admin -d music_db
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/tracks.sql

psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/track_artist_colab.sql
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/create_indexes.sql
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/drop_duplicates.sql

psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/create_count_colum.sql
psql -h localhost -p 5432 -U dobo_admin -d music_db -f sql_scripts/asign_user_to_data.sql



week 9. log in users should be able to add conf to see how many itmes they can see on page.

psql -h localhost -p 5432 -U dobo_admin -d music_db -c "SELECT COUNT(*) FROM music_trackartistcolab;"
psql -h localhost -p 5432 -U dobo_admin -d music_db -c "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name LIKE 'music%';"

psql -h localhost -p 5432 -U dobo_admin -d music_db -c  "SELECT * FROM pg_stat_activity WHERE state = 'active';"
SELECT * FROM pg_stat_activity;


            #   python manage.py non_interactive_makemigrations &&
            #   python manage.py migrate &&
            # #  python manage.py populate_db &&
            #   python manage.py collectstatic --no-input --clear &&
            # #  gunicorn -b 0.0.0.0:8000 music_library.wsgi &&
            #   python manage.py runserver 0.0.0.0:8000"



\copy (SELECT conname AS constraint_name, conrelid::regclass AS table_name, pg_get_constraintdef(pg_constraint.oid) AS constraint_definition FROM pg_constraint WHERE conrelid::regclass::text LIKE 'music%') TO '/sql_scripts/constraints.csv' CSV HEADER;
\copy (SELECT tablename, indexname, indexdef FROM pg_indexes WHERE tablename LIKE 'music%') TO '/sql_scripts/indexes.csv' CSV HEADER;

