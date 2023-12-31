const axios = require("axios");
const fs = require('fs')
const config = require('../config.json');
const headers = {
    Authorization: ` `
}

const spotify = () => {
    //generate spotify Token
    async function generateToken() {
        const options = {
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization: 'Basic ' + (new Buffer.from(config.clientID+ ':' + config.clientSecret).toString('base64')),
            },
            params: {
                grant_type: 'client_credentials'
            },
            json: true
        }

        try {
            const token = await axios.request(options)

            headers.Authorization = `${token.data.token_type} ${token.data.access_token}`
        } catch (error) {
            console.error(error);
        }

    }

    // get list of tracks related to user search input
    async function getTracks (name, offset, limit) {
        const options = {
            method: 'get',
            url: `${config.spotifyBaseURL}/search?q=${name}&type=track&market=US&offset=${offset}&limit=${limit}`,
            headers
        }
        
        try {
            const tracks = await axios.request(options);
            
            if(tracks.data.tracks.items.length === 0) tracks.data.tracks.next = null
            
            return tracks.data.tracks
        } catch (error) {
            console.error(error);
        }
    };

    // get info for specific track
    async function getTrackInfo(id) {
        const options = {
            method: 'get',
            url: `${config.spotifyBaseURL}/tracks/${id}`,
            headers
        }
        
        try {
            const trackInfo = await axios.request(options);
            return [trackInfo.data];
        } catch (error) {
            console.error(error)
        }
    };


    async function getTopGlobalSongs(offset=0) {
        const options = {
            method: 'get',
            url: `${config.spotifyBaseURL}/playlists/37i9dQZEVXbNG2KDcFcKOF/tracks?offset=${offset}&limit=10`,
            headers
        }

        try {
            const songs = await axios.request(options);
            const tracks =  songs.data.items.map((item) => {
                return item.track
            });

            return {next:songs.data.next, previous:songs.data.previous, tracks}
        } catch (error) {
            console.error(error)
        }
    }

    async function getAlbumTracks(id, limit=10, offset=0) {
        const options = {
            method: 'get',
            url: `${config.spotifyBaseURL}/albums/${id}/tracks?limit=${limit}&offset=${offset}`,
            headers
        }

        try {
            const songs = await axios.request(options);
            
            return songs.data
        } catch (error) {
            console.error(error)
        }
    }

    async function getArtistTopTracks(id) {
        const options = {
            method: 'get',
            url: `${config.spotifyBaseURL}/artists/${id}/top-tracks?market=US`,
            headers
        }

        try {
            const songs = await axios.request(options);
            
            return songs.data
        } catch (error) {
            console.error(error)
        }
    }

    return {
        generateToken,
        getTracks,
        getTrackInfo,
        getTopGlobalSongs,
        getAlbumTracks,
        getArtistTopTracks
    }
}

module.exports = spotify();