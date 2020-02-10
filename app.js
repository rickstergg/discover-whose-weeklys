/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request-promise'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '0a0c39b210d94b8bab6e39d21e46ef7a'; // Your client id
var client_secret = '0bb080fbe3d14d1d8f5e871ab950d457'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri, add if it doesn't exist already in app settings.
const { createPlaylist, getAllSongsFromPlaylists, addSongsToPlaylist } = require('./utils/api');

const playlistIds = [
  '37i9dQZEVXcNbkdjqiBYAa',
  '37i9dQZEVXcPAHESJrxEYO',
  '37i9dQZEVXcPt6vVrR5lta',
  '37i9dQZEVXcFM6piYkUYgR'
];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// Creates an internal state and redirects the user to prompt authentication and scope approvals.
app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// Spotify API comes back with valid tokens for me to use for the user's account.
// These include fetching other discovery playlists, creating our own, and adding tracks to it.
app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  var accessToken, refreshToken, hostId, masterPlaylistId = null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions)
      .then(({ access_token: access, refresh_token: refresh}) => {
        accessToken = access;
        refresh = refresh;

        var meOptions = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access },
          json: true
        };
        return request.get(meOptions);
      })
      .then(({ id: userId }) => {
        hostId = userId;
        const playlistName = 'hello poppet';
        return createPlaylist({ userId, playlistName, accessToken });
      })
      .then((resp) => {
        const { id: playlistId } = JSON.parse(resp);
        masterPlaylistId = playlistId;
        return getAllSongsFromPlaylists({ playlistIds, numberOfSongs: 5, accessToken });
      })
      .then(songURIs => {
        return addSongsToPlaylist({ playlistId: masterPlaylistId, songURIs, accessToken });
      })
      .catch(error => console.log(error));
  }
});

console.log('Listening on 8888');
app.listen(8888);
