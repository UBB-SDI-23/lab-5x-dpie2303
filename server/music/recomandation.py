from django_pandas.io import read_frame
from .models import Track, Playlist
from sklearn.neighbors import NearestNeighbors
import pandas as pd
import logging
import numpy as np
logger = logging.getLogger(__name__)


def recomand_tracks(user_id,n_recommendations=10):


    columns = ['id', 'bpm', 'released']
    tracks_sample = 300000

    tracks = Track.objects.values(*columns)[:tracks_sample]
    logging.info('tracks ware readed')
    df_track = pd.DataFrame.from_records(tracks)
    logging.info('tracks ware converted to dataframe')
    df_track.set_index('id', inplace=True)

    user_playlists = Playlist.objects.filter(user_id=user_id)
    user_songs = [track for playlist in user_playlists for track in playlist.tracks.all()]
    df_user_songs = pd.DataFrame.from_records([song.__dict__ for song in user_songs])
    df_user_songs = df_user_songs[columns]
    df_user_songs.set_index('id', inplace=True)

    model = NearestNeighbors(n_neighbors=n_recommendations, metric='cosine')  # you can adjust parameters as needed
    model.fit(df_track)
    logging.info('model was fitted')
    closest_songs = []

    for song in user_songs:
        distances, indices = model.kneighbors(pd.DataFrame(np.array(df_user_songs.loc[song.id]).reshape(1, -1), columns=df_user_songs.columns))
        closest_songs.extend(df_track.index[indices[0]])
    
    song_freq = pd.Series(closest_songs).value_counts()
    song_freq = song_freq[~song_freq.index.isin(user_songs)]
    recommended_songs = song_freq.index[:n_recommendations]

    return recommended_songs.tolist()