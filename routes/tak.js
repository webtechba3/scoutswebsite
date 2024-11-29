const express = require('express');
const axios = require('axios');
const router = express.Router();

// Array van takken
const takken = ['Kapoenen', 'Welpen', 'Roeland', 'Parcival', 'Givers', 'Jin', 'Leiding'];
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
            console.log('relatie gevonden:', relaties);

            if (!relaties.length) {
                return res.status(404).send('Geen activiteiten gevonden.');
            }

            for (let relatie of relaties) {
                // Zoek activiteiten via de relatie
                const nietGlobaleActiviteiten = await activiteitenCollection.findOne({ _id: relatie.activiteitId });
                //console.log('activiteitenCollection', activiteitenCollection);
                console.log('Activiteit ID in relatie:', relatie.activiteitId);
                console.log('Niet-globale activiteit gevonden:', nietGlobaleActiviteiten);


                if (!nietGlobaleActiviteiten) {
                    continue; // Sla over als de activiteit niet bestaat
                }

                // Haal gebruiker op via relatie
                const user = await usersCollection.findOne({ _id: relatie.userId });
                console.log('Gebruiker gevonden:', user);

                if (!user) {
                    continue; // Sla over als de gebruiker niet bestaat
                }

                // Filter activiteiten op basis van de tak van de gebruiker
                if (
                    nietGlobaleActiviteiten.target &&
                    user.tak &&
                    tak &&
                    nietGlobaleActiviteiten.target.toLowerCase() === 'nietglobaal' &&
                    user.tak.toLowerCase() === tak.toLowerCase()
                )
                 {
                    console.log('Niet-globale activiteit target:', nietGlobaleActiviteiten.target);
                    console.log('User tak:', user.tak);
                    console.log('Route tak:', tak);
                    // Voeg auteur toe aan de activiteit
                    nietGlobaleActiviteiten.auteur = `${user.voornaam} ${user.naam}`;
                    activiteiten.push(nietGlobaleActiviteiten);
                }
            }
/*
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
            */
            // Geef het pad naar de juiste submap voor de betreffende tak
            
            const takViewPath = path.join(__dirname, '../views/tak', tak);
            res.render(takViewPath, { title: `${tak}`, activiteiten: activiteiten });
            console.log(`Ophalen activiteiten ${tak}`, activiteiten);
        } catch (error) {
            console.error('Fout bij het ophalen van activiteiten:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten.');

        }
    });
});

module.exports = router;
