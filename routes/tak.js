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
            const nietGlobaleActiviteiten = await activiteitenCollection.find({ target:"nietglobaal"}).toArray();

            // Haal de gebruiker op, bijv. via sessie
            const user = await usersCollection.findOne({ voornaam: req.session.voornaam }); // Zorg dat je sessie gebruikt

            if (!user) {
                return res.status(404).send('');
            }

            // Filter de activiteiten voor de juiste tak van de gebruiker
            const filteredActiviteiten = nietGlobaleActiviteiten.filter(activiteit => {
                return activiteit.target.toLowerCase() === tak.toLowerCase() && user.tak.toLowerCase() === tak.toLowerCase();
            });

            // Voeg de naam en voornaam van de auteur toe aan de gefilterde activiteiten
            for (let activiteit of filteredActiviteiten) {
                const relatie = await linkuseractiviteit.findOne({ activiteitId: activiteit._id });

                if (relatie) {
                    const activiteitUser = await usersCollection.findOne({ _id: relatie.userId });

                    if (activiteitUser) {
                        activiteit.auteur = `${activiteitUser.voornaam} ${activiteitUser.naam}`; // Voeg de volledige naam van de auteur toe
                    } else {
                        activiteit.auteur = "Onbekend"; // Als er geen gebruiker is, zet je de auteur als "Onbekend"
                    }
                } else {
                    activiteit.auteur = "Onbekend"; // Als er geen relatie is, zet je de auteur als "Onbekend"
                }
            }

            // Geef het pad naar de juiste submap voor de betreffende tak
            const takViewPath = path.join(__dirname, '../views/tak', tak);
            res.render(takViewPath, { title: `Welkom bij de ${tak}`, activiteiten: filteredActiviteiten });
        } catch (error) {
            console.error('Fout bij het ophalen van activiteiten:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten.');
        }
    });
});

module.exports = router;