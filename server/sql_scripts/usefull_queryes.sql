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

