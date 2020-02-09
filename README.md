# Discover Whose Weeklys

A game where you guess players' discover weekly songs and score points for knowing the musical tastes that Spotify has for your friends!

## Dev Usage

Install this app and get yourself a client ID and secret. Populate the right fields and you should go through the authentication app and after that, use it like a user. See the next section.

## User Usage

Will eventually be hosted somewhere but the app flow will look like this:

1. Authenticate the user. We don't really need any special scopes, just an access token to hit the Spotify API with. Ideally would like this app to auto generate a playlist with a song to player mapping for ease of looking it up.
2. Have the paste lists or IDs of Spotify Weekly Playlists. Would also be cool to pass in the username and have it auto fetch the Spotify Weekly.
3. Once all the IDs have been gathered, create a Playlist for the authenticated user called Discover Whose Weeklys (Timestamp).
4. Listen, play, laugh, and score!
