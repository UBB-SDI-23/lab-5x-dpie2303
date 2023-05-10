from faker import Faker
import random
from datetime import datetime

fake = Faker()

collaboration_types = [
    'Producer',
    'Featured',
    'Writer',
    'Composer',
    'Arranger',
    'Mixer',
    'Engineer',
    'Backing Vocals',
    'Instrumentalist',
    'Programmer',
    'Sampling',
    'Mastering Engineer',
    'Executive Producer',
    'Art Director',
    'Video Director',
    'Choreographer',
    'Session Musician',
    'Orchestrator',
    'Lyricist',
    'Sound Designer',
    'Remixer',
    'Sound Engineer',
    'Recordist',
    'Music Editor',
    'Vocal Coach',
    'Music Supervisor',
    'Photographer'
]

genres_list = [    "Alternative",    "Ambient",    "Blues",    "Classical",    "Country",    "Dance",    "Electronic",    "Folk",    "Hip-Hop",    "Indie",    "Jazz",    "Latin",    "Metal",    "New Age",    "Pop",    "Punk",    "R&B",    "Rap",    "Reggae",    "Rock",    "Soul",    "World",    "Acid Jazz",    "Adult Contemporary",    "African",    "Afro-Cuban",    "Alternative Country",    "Americana",    "Arabic",    "Asian",    "Avant-Garde",    "Bachata",    "Baroque",    "Big Band",    "Bluegrass",    "Boogie Woogie",    "Bossa Nova",    "Calypso",    "Celtic",    "Chamber Music",    "Chanson",    "Choral",    "Christian",    "Classic Rock",    "Contemporary",    "Cool Jazz",    "Country Rock",    "Cowpunk",    "Creole"]


def write_batch_inserts(file, table_name, columns, values):
    
    insert_query = f"INSERT INTO {table_name} {columns} VALUES {', '.join(values)};"
    file.write("BEGIN;\n")
    file.write(insert_query + "\n")
    file.write("COMMIT;\n")

def generate_albums_sql(num_albums, num_record_companies, batch_size=1000):
    with open('sql_scripts/albums.sql', 'w') as f:
        values_batch = []
        for i in range(num_albums):
            name = fake.catch_phrase().replace("'", "''")
            description = fake.text(max_nb_chars=60).replace("'", "''")
            top_rank = random.randint(1, 100)
            copy_sales = random.randint(1000, 1000000)
            release_date = fake.date_between(start_date='-80y', end_date='today')
            record_company_id = random.randint(1, num_record_companies)
            values_batch.append(f"('{name}', '{description}', {top_rank}, {copy_sales}, '{release_date}', {record_company_id})")

            if (i + 1) % batch_size == 0:
                write_batch_inserts(f, 'music_album', '(name, description, top_rank, copy_sales, release_date, record_company_id)', values_batch)
                values_batch = []

        if values_batch:
            write_batch_inserts(f, 'music_album', '(name, description, top_rank, copy_sales, release_date, record_company_id)', values_batch)



def generate_record_companies_sql(num_companies, batch_size=1000):
    with open('sql_scripts/record_companies.sql', 'w') as f:
        values_batch = []
        for i in range(num_companies):
            name = fake.company().replace("'", "''")
            founded_date = fake.date_between(start_date='-100y', end_date='today')
            headquarters_location = fake.city().replace("'", "''")
            contact_email = fake.email().replace("'", "''")
            values_batch.append(f"('{name}', '{founded_date}', '{headquarters_location}', '{contact_email}')")

            if (i + 1) % batch_size == 0:
                write_batch_inserts(f, 'music_recordcompany', '(name, founded_date, headquarters_location, contact_email)', values_batch)
                values_batch = []

        if values_batch:
            write_batch_inserts(f, 'music_recordcompany', '(name, founded_date, headquarters_location, contact_email)', values_batch)


def generate_artists_sql(num_artists, batch_size=1000):
    with open('sql_scripts/artists.sql', 'w') as f:
        values_batch = []
        for i in range(num_artists):
            name = fake.name().replace("'", "''")
            birth_day = fake.date_between(start_date='-80y', end_date='today')
            country_of_origin = fake.country().replace("'", "''")
            sex = random.choice(['Male', 'Female', 'Other'])
            description = fake.text(max_nb_chars=60).replace("'", "''")
            values_batch.append(f"('{name}', '{country_of_origin}', '{sex}', '{description}', '{birth_day}')")

            if (i + 1) % batch_size == 0:
                write_batch_inserts(f, 'music_artist', '(name, country_of_origin, sex, description, birth_day)', values_batch)
                values_batch = []

        if values_batch:
            write_batch_inserts(f, 'music_artist', '(name, country_of_origin, sex, description, birth_day)', values_batch)


def generate_tracks_sql(num_tracks, num_albums, batch_size=1000):
    with open('sql_scripts/tracks.sql', 'w') as f:
        values_batch = []
        for i in range(num_tracks):
            name = fake.catch_phrase().replace("'", "''")
            selected_genres = random.sample(genres_list, k=random.randint(1, 3))
            genres = ", ".join(selected_genres).replace("'", "''")
            description = fake.text(max_nb_chars=60).replace("'", "''")
            bpm = random.randint(60, 200)
            released = random.randint(1950, 2022)
            album_id = random.randint(1, num_albums)
            values_batch.append(f"('{name}', '{genres}', '{description}', {bpm}, {released}, {album_id})")

            if (i + 1) % batch_size == 0:
                write_batch_inserts(f, 'music_track', '(name, genres, description, bpm, released, album_id)', values_batch)
                values_batch = []

        if values_batch:
            write_batch_inserts(f, 'music_track', '(name, genres, description, bpm, released, album_id)', values_batch)



def generate_track_artist_colab_sql(num_colabs, num_tracks, num_artists, batch_size=1000):
    with open('sql_scripts/track_artist_colab.sql', 'w') as f:
        values_batch = []
        for _ in range(num_colabs):
            track_id = random.randint(1, num_tracks)
            artist_id = random.randint(1, num_artists)
            collaboration_type = random.choice(collaboration_types)
            royalty_percentage = round(random.uniform(0, 100), 2)
            values_batch.append(f"({track_id}, {artist_id}, '{collaboration_type}', {royalty_percentage})")

            if len(values_batch) % batch_size == 0:
                write_batch_inserts(f, 'music_trackartistcolab', '(track_id, artist_id, collaboration_type, royalty_percentage)', values_batch)
                values_batch = []

        if values_batch:
            write_batch_inserts(f, 'music_trackartistcolab', '(track_id, artist_id, collaboration_type, royalty_percentage)', values_batch)



if __name__ == "__main__":
    num_record_companies = 1000000
    num_albums = 1000000
    num_tracks = 10000000
    num_artists = 1000000
    num_colabs = 10000000
    batch_size = 100

    # num_record_companies = 5
    # num_albums = 5
    # num_tracks = 5
    # num_artists = 5
    # num_colabs = 10
    # batch_size = 2

    # generate_record_companies_sql(num_record_companies, batch_size)
    # print('record companies done')
    # generate_albums_sql(num_albums, num_record_companies, batch_size)
    # print('albums done')
    generate_tracks_sql(num_tracks, num_albums, batch_size)
    print('tracks done')
    # generate_artists_sql(num_artists, batch_size)
    # print('artists done')
    # generate_track_artist_colab_sql(num_colabs, num_tracks, num_artists, batch_size)
    # print('track artist colab done')