const express = require('express');
const spotify = require('./spotify');
const mongo = require('./db');
const app = express();
const port = 8888;

spotify.generateToken()

setInterval(() => {
    api.generateToken()
    console.log("new token generated")
}, 3300000)


const search = require('./routes/search.js');
app.use('/search', search);

const topGlobalSongs = require('./routes/topGlobalSongs.js');
app.use('/topGlobalSongs', topGlobalSongs)

const publicRecommendations = require('./routes/publicRecommendations.js');
app.use('/publicRecommendations', publicRecommendations)

const albumTracks = require('./routes/album.js')
app.use('/album', albumTracks)

const artistTopTracks = require('./routes/artistsTopTracks')
app.use('/artistTopTracks', artistTopTracks)

app.listen(port, async () => {
    console.log(`Server is listening on port ${port}`);
    await mongo.connect();
});
