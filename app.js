const express = require('express'); // Express web server framework
const request = require('request-promise'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = '0a0c39b210d94b8bab6e39d21e46ef7a'; // Your client id
const client_secret = '0bb080fbe3d14d1d8f5e871ab950d457'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri, add if it doesn't exist already in app settings.
const { createPlaylist, getAllSongsFromPlaylists, addSongsToPlaylist } = require('./utils/api');
const { getArtistsAndNames } = require('./utils/helpers');

// We know whose is whose, so we can use these IDs to reverse link the songs coming back from the API
const playlistIds = [
  '37i9dQZEVXcNbkdjqiBYAa', // Rick
  '37i9dQZEVXcPAHESJrxEYO', // Elisa
  '37i9dQZEVXcPt6vVrR5lta', // Pango
  '37i9dQZEVXcFM6piYkUYgR'  // Viv
];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(cors())
   .use(cookieParser());

// Creates an internal state and redirects the user to prompt authentication and scope approvals.
app.get('/', function(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'playlist-modify-public playlist-modify-private';
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
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
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
      .then(({ access_token: accessToken, refresh_token: refreshToken }) => {
        res.render('index', { accessToken, refreshToken });
      })
      .catch(error => res.render('index', { error }));
  }
});

app.get('/construct', function(req, res) {
  const accessToken = req.query.accessToken;
  const refreshToken = req.query.refreshToken;
  // const playlistIds = req.query.playlistIds; when it's ready

  let hostId, masterPlaylistId, songList = null;
  const MASTER_PLAYLIST_NAME = "hello poppet";

  const meOptions = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };

  request.get(meOptions)
    .then(({ id: userId }) => {
      hostId = userId;
      const playlistName = MASTER_PLAYLIST_NAME;
      return createPlaylist({ userId, playlistName, accessToken });
    })
    .then((resp) => {
      const { id: playlistId } = JSON.parse(resp);
      masterPlaylistId = playlistId;
      return getAllSongsFromPlaylists({ playlistIds, numberOfSongs: 5, accessToken });
    })
    .then((resp) => {
      let songs = [], uris = [];
      resp.map(playlist => {
        songs = songs.concat(playlist.songs);
        uris = uris.concat(playlist.uris);
      });

      // TODO: Shuffle the array before adding it to the masterPlaylistId
      songList = songs;
      return addSongsToPlaylist({ playlistId: masterPlaylistId, songURIs: uris, accessToken });
    })
    .then((resp) => {
      res.render('constructed', { songList: getArtistsAndNames(songList) });
    })
    .catch(error => console.log(error));
});

console.log('Listening on 8888');
app.listen(8888);
