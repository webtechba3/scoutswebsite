const express = require('express');
const router = express.Router();
const takken = ['kapoenen', 'welpen', 'roeland', 'parcival', 'givers', 'jin'];
const path = require('path');
/*takken.forEach(tak => {
    router.get(`/${tak}`, (req, res) => {
      // Geef expliciet het pad naar de juiste submap bij het renderen
      const takViewPath = path.join(__dirname, '../views/tak', tak);
      res.render(takViewPath, { title: `Welkom bij de ${tak}` });
    });
  });
  
 */
  takken.forEach(tak => {
    router.get(`/${tak}`, async (req, res) => {
        try {
            const db = req.app.locals; // Verkrijg de collecties
            const activiteitenCollection = db.activiteitenCollection;
            const usersCollection = db.usersCollection; // Voeg de users collectie toe
            const linkuseractiviteit = db.linkuseractiviteit; // Voeg de linkuseractiviteit collectie toe

            // Zoek alle activiteiten waarvan de target niet "globaal" is
            activiteiten = [];
            const relaties = await linkuseractiviteit.find({ target: 'nietglobaal' }).toArray();

            if (!relaties.length) {
                return res.status(404).send('Geen activiteiten gevonden.');
            }

            // Haal de gebruiker op, bijv. via sessie
            const user = await usersCollection.findOne({ id: nietGlobaleActiviteiten.userId });
            if (!user) {
                return res.status(404).send('user niet gevonden');
            }

            // tot hier werkt het al 
            // Filter de activiteiten voor de juiste tak van de gebruiker
            for (let relatie of relaties) {
            const nietGlobaleActiviteiten = await activiteitenCollection.find({id : activiteit.activiteitId});
            const filteredActiviteiten = nietGlobaleActiviteiten.filter(activiteit => {
                return activiteit.target.toLowerCase() === tak.toLowerCase() && user.tak.toLowerCase() === tak.toLowerCase();
            });
            activiteiten.push(filteredActiviteiten);
            
            } 
            // Geef het pad naar de juiste submap voor de betreffende tak
            const takViewPath = path.join(__dirname, '../views/tak', tak);
            res.render(takViewPath, { title: `Welkom bij de ${tak}`, activiteiten: activiteiten });
        } catch (error) {
            console.error('Fout bij het ophalen van activiteiten:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten.');

        }
    });
});

module.exports = router;