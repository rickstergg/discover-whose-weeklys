var request = require('request-promise');

const createPlaylist = ({ userId, playlistName, accessToken }) => {
  const data = {
    name: playlistName,
    description: 'Generated for Discover Whose Weeklys, made today!',
  };

  const requestOptions = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    body: JSON.stringify(data),
  };

  return request(requestOptions);
}

const getSongs = ({ playlistId, numberOfSongs, accessToken }) => {
  const requestOptions = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  };

  return request(requestOptions)
    .then(resp => {
      const data = JSON.parse(resp);
      const songs = data.tracks.items.slice(0, numberOfSongs);
      const uris = songs.map(t => t.track.uri);
      return { uris, songs };
    });
}

const getAllSongsFromPlaylists = ({ playlistIds, numberOfSongs, accessToken }) => {
  return Promise.all(playlistIds.map((id => getSongs({ playlistId: id, numberOfSongs, accessToken }))));
}

const addSongsToPlaylist = ({ playlistId, songURIs, accessToken }) => {
  const data = {
    uris: [].concat.apply([], songURIs)
  };

  const requestOptions = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    body: JSON.stringify(data),
  };

  return request(requestOptions);
}

module.exports = {
  createPlaylist,
  getAllSongsFromPlaylists,
  addSongsToPlaylist,
}
