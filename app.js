require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  try {
    res.render('index');
  } catch (e) {
    console.log(e);
  }
});

app.get('/artist-search', async (req, res) => {
  try {
    const data = await spotifyApi.searchArtists(req.query.artist);
    console.log('The received data from the API: ', data.body);
    const artists = data.body.artists.items;
    res.render('artist-search-results', { artists });
    console.log(artists);
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

app.get('/albums/:id', async (req, res) => {
  const response = await spotifyApi.getArtistAlbums(req.params.id);
  const albums = response.body.items;

  res.render('albums', { albums });
});

app.get('/tracks/:id', async (req, res) => {
  const response = await spotifyApi.getAlbumTracks(req.params.id);
  const tracks = response.body.items;

  res.render('tracks', { tracks });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
