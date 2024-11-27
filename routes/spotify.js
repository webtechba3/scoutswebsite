const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID; // Vanuit .env voor veiligheid
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Vanuit .env voor veiligheid
const REDIRECT_URI = process.env.REDIRECT_URI; // Callback-URL die met Spotify overeenkomt
const PLAYLIST_ID = process.env.PLAYLIST_ID; // Afspeellijst-ID vanuit .env (optioneel)

let accessToken = null;
let refreshToken = null;

router.get('/givers', async (req, res) => {
    if (!req.session.accessToken) {
        console.warn('Geen toegangstoken gevonden in sessie. Doorsturen naar login.');
        return res.redirect('/spotify/spotify-login');
    }

    try {
        // Haal de afspeellijstgegevens op
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });

        console.log('Afspeellijstgegevens opgehaald:', response.data);

        // Render de givers pagina met de afspeellijstgegevens
        res.render('tak/givers', {
            title: 'Giver',
            accessToken: req.session.accessToken,
            playlist: response.data,
        });
    } catch (error) {
        console.error('Fout bij ophalen afspeellijst:', error.response?.data || error.message);
        res.status(500).send('Kan de afspeellijst niet ophalen.');
    }
});

// 1. Route voor inloggen met Spotify
router.get('/spotify-login', (req, res) => {
    const state = Math.random().toString(36).substring(2, 15); // Willekeurige state-token voor veiligheid
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

// 2. Callback om access token op te halen
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

        req.session.accessToken = response.data.access_token; // Sla token op in sessie
        req.session.refreshToken = response.data.refresh_token;

        console.log('Access token opgehaald en opgeslagen in sessie:', req.session.accessToken);

        res.redirect('/tak/givers');
    } catch (error) {
        console.error('Authenticatie fout:', error.response?.data || error.message);
        res.send('Authenticatie mislukt.');
    }
});


router.get('/tak/givers', (req, res) => {
    if (!req.session.accessToken) {
        console.warn('Geen access token gevonden in sessie. Doorsturen naar login.');
        return res.redirect('/spotify/spotify-login');
    }

    console.log('Token in render-aanroep (sessie):', req.session.accessToken);
    res.render('tak/givers', {
        title: 'Giver',
        accessToken: req.session.accessToken, // Haal de token uit de sessie
    });
});



// 3. Functie om access token te vernieuwen
async function refreshAccessToken() {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        accessToken = response.data.access_token; // Nieuwe access token opslaan
        console.log('Access token vernieuwd');
    } catch (error) {
        console.error('Fout bij vernieuwen van token:', error);
    }
}

// Middleware om token te verversen indien nodig
router.use(async (req, res, next) => {
    if (!accessToken) {
        await refreshAccessToken(); // Vernieuw de token als deze niet beschikbaar is
    }
    next();
});

// 4. Route om nummers te zoeken
router.post('/spotify/search', async (req, res) => {
    const query = req.body.query;

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                q: query,
                type: 'track',
                limit: 5,
            },
        });

        res.json(response.data.tracks.items); // Stuur de nummers terug naar de frontend
    } catch (error) {
        console.error('Fout bij zoeken:', error);
        res.status(500).send('Zoeken mislukt.');
    }
});

// 5. Route om nummers aan een afspeellijst toe te voegen
router.post('/spotify/add-to-playlist', async (req, res) => {
    const { trackUri } = req.body;

    try {
        await axios.post(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
            uris: [trackUri],
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.send({ success: true, message: 'Nummer toegevoegd!' });
    } catch (error) {
        console.error('Fout bij toevoegen aan playlist:', error);
        res.status(500).send({ success: false, message: 'Toevoegen mislukt.' });
    }
});

module.exports = router;
