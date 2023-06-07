from django_pandas.io import read_frame
from .models import Track, Playlist
from sklearn.neighbors import NearestNeighbors
import pandas as pd
import logging
import numpy as np
logger = logging.getLogger(__name__)


def recomand_tracks(user_id,n_recommendations=10):


    # # Get all tracks
    # tracks = Track.objects.all()
    # df_track = read_frame(tracks)
    # logging.info(df_track.columns)
    # # Convert genres to one-hot encoding
    # # df_track = df_track.join(df_track.pop('genres').str.get_dummies(','))
    # # Remove unnecessary columns
    # df_track.drop(columns=['user','name','description','album','genres'], inplace=True)
    # # Set 'id' as the index for easier access

    # Specify the columns you want
    columns = ['id', 'bpm', 'released']

    # Get all tracks with only the specified columns
    tracks = Track.objects.values(*columns)
    logging.info('tracks ware readed')
    # Convert the QuerySet to a DataFrame
    df_track = pd.DataFrame.from_records(tracks)
    logging.info('tracks ware converted to dataframe')
    # Set 'id' as the index for easier access
    df_track.set_index('id', inplace=True)

    # Get user's playlists
    user_playlists = Playlist.objects.filter(user_id=user_id)

    # Get track ids for each playlist
    user_songs = [track.id for playlist in user_playlists for track in playlist.tracks.all()]

    # Fit NearestNeighbors model
    model = NearestNeighbors(n_neighbors=n_recommendations, metric='cosine')  # you can adjust parameters as needed
    model.fit(df_track)
    logging.info('model was fitted')
    # Initialize an empty list to store the closest songs
    closest_songs = []

    for song in user_songs:
        distances, indices = model.kneighbors(pd.DataFrame(np.array(df_track.loc[song]).reshape(1, -1), columns=df_track.columns))
        closest_songs.extend(df_track.index[indices[0]])
        logging.info('closest songs ware extended')
    # Count frequency of each song
    song_freq = pd.Series(closest_songs).value_counts()

    # Remove songs already in user's playlist
    song_freq = song_freq[~song_freq.index.isin(user_songs)]
    
    # Recommend songs with highest frequency
    recommended_songs = song_freq.index[:n_recommendations]

    return recommended_songs.tolist()