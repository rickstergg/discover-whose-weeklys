var request = require('request');

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

  request(requestOptions, function(error, response, body) {
    if (response.statusCode === 200 || response.statusCode === 201) {
      const { id } = JSON.parse(body);
      return id;
    }
  });
}

module.exports = {
  createPlaylist,
}
