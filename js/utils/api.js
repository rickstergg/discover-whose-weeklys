var request = require('request-promise');
const { playlistIdMap, lookUpOwner } = require('./helpers');

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

  const owner = lookUpOwner(playlistId);

  return request(requestOptions)
    .then(resp => {
      const data = JSON.parse(resp);
      const songs = data.tracks.items.slice(0, numberOfSongs);
      songs.forEach((song) => {
        song.owner = owner;
      });
      return { songs };
    });
}

const getAllSongsFromPlaylists = ({ playlistIds, numberOfSongs, accessToken }) => {
  return Promise.all(playlistIds.map((id => getSongs({ playlistId: id, numberOfSongs, accessToken }))));
}

const addSongsToPlaylist = ({ playlistId, songURIs, accessToken }) => {
  const data = {
    uris: songURIs
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
