const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PLAYLIST_ID = process.env.PLAYLIST_ID;

// Helperfunctie om een URL naar een URI om te zetten
function convertUrlToUri(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? `spotify:track:${match[1]}` : null;
}

// Middleware om te voorkomen dat bepaalde routes in een redirect-loop komen
router.use(async (req, res, next) => {
    const allowedRoutes = ['/spotify-login', '/callback'];
    if (!req.session.accessToken && !allowedRoutes.includes(req.path)) {
        console.warn('Geen toegangstoken gevonden in sessie. Doorsturen naar login.');
        return res.redirect('/spotify/spotify-login');
    }
    next();
});

// Route: Inloggen bij Spotify
router.get('/spotify-login', (req, res) => {
    const state = Math.random().toString(36).substring(2, 15);
    const scopes = 'playlist-modify-public playlist-modify-private';

    const params = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scopes,
        state: state,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// Route: Callback om toegangstoken op te halen
router.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;

        console.log('Access token succesvol opgehaald:', req.session.accessToken);
        res.redirect('/spotify');
    } catch (error) {
        console.error('Fout bij ophalen access token:', error.response?.data || error.message);
        res.status(500).send('Authenticatie mislukt.');
    }
});

// Route: Dashboard of playlistinformatie
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });

        res.render('spotify', {
            title: 'Spotify Integration',
            playlist: response.data,
            accessToken: req.session.accessToken,
        });
    } catch (error) {
        console.error('Fout bij ophalen afspeellijst:', error.response?.data || error.message);
        res.status(500).send('Kan de afspeellijst niet ophalen.');
    }
});

// Route: Zoek naar nummers
router.post('/search', async (req, res) => {
    const query = req.body.query;

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
            params: { q: query, type: 'track', limit: 5 },
        });

        console.log('Spotify API Response:', response.data.tracks.items); // Debugging
        res.json(response.data.tracks.items);
    } catch (error) {
        console.error('Fout bij zoeken:', error.response?.data || error.message);
        res.status(500).json({ error: 'Zoeken mislukt.' }); // Retourneer ook een JSON-fout
    }
});

// Route: Nummer toevoegen aan afspeellijst
router.post('/add-to-playlist', async (req, res) => {
    let { trackUri } = req.body;

    // Controleer en converteer URL naar URI
    if (trackUri.startsWith('http')) {
        trackUri = convertUrlToUri(trackUri);
        if (!trackUri) {
            return res.status(400).send({ success: false, message: 'Ongeldige URL ingevoerd.' });
        }
    }

    try {
        await axios.post(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
            uris: [trackUri],
        }, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });

        // Stuur een succesbericht terug naar de client
        res.status(200).send({ success: true, message: 'Nummer succesvol toegevoegd!' });
    } catch (error) {
        console.error('Fout bij toevoegen aan playlist:', error.response?.data || error.message);
        res.status(500).send({ success: false, message: 'Toevoegen mislukt.' });
    }
});

module.exports = router;
