#!/bin/bash

echo "Executing drop_indexes.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/drop_indexes.sql
echo "Finished executing drop_indexes.sql."

echo "Executing users.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/users.sql
echo "Finished executing users.sql."

echo "Executing user_profiles.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/user_profiles.sql
echo "Finished executing user_profiles.sql."

echo "Executing record_companies.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/record_companies.sql
echo "Finished executing record_companies.sql."

echo "Executing albums.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/albums.sql
echo "Finished executing albums.sql."

echo "Executing tracks.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/tracks.sql
echo "Finished executing tracks.sql."

echo "Executing artists.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/artists.sql
echo "Finished executing artists.sql."

echo "Executing track_artist_colab.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/track_artist_colab.sql
echo "Finished executing track_artist_colab.sql."

echo "Executing create_indexes.sql..."
psql -h localhost -p 5432 -U dobo_admin -d music_db -f /sql_scripts/create_indexes.sql
echo "Finished executing create_indexes.sql."
