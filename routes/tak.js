const express = require('express');
const axios = require('axios');
const router = express.Router();

// Array van takken
const takken = ['kapoenen', 'welpen', 'roeland', 'parcival', 'givers', 'jin'];

// Voeg routes toe voor elke tak
takken.forEach(tak => {
    router.get(`/${tak}`, async (req, res) => {
        // Controleer of het accessToken beschikbaar is in de sessie
        const accessToken = req.session?.accessToken || null;

        if (!accessToken) {
            console.warn(`Geen toegangstoken gevonden voor ${tak}. Doorsturen naar login.`);
            return res.redirect('/spotify/spotify-login'); // Stuur naar Spotify login als er geen token is
        }

        try {
            // Haal de afspeellijstgegevens op voor de `givers` pagina
            const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${process.env.PLAYLIST_ID}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const playlist = playlistResponse.data;

            // Render de juiste Pug-template met de accessToken en afspeellijst
            res.render(`tak/${tak}`, { 
                title: `Welkom bij ${tak}`,
                tak: tak,
                accessToken: accessToken, // Geef het accessToken door
                playlist: playlist, // Voeg de afspeellijstgegevens toe
            });
        } catch (error) {
            console.error('Fout bij ophalen afspeellijst:', error.response?.data || error.message);
            res.status(500).send('Kan de afspeellijst niet ophalen.');
        }
    });
});

// Exporteer de router
module.exports = router;
