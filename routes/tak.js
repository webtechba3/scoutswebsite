const express = require('express');
const axios = require('axios');
const router = express.Router();

// Array van takken
const takken = ['kapoenen', 'welpen', 'roeland', 'parcival', 'givers', 'jin', 'leiding'];
const path = require('path');

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
        ) {
          console.log('Niet-globale activiteit target:', nietGlobaleActiviteiten.target);
          console.log('User tak:', user.tak);
          console.log('Route tak:', tak);
          // Voeg auteur toe aan de activiteit
          nietGlobaleActiviteiten.auteur = `${user.voornaam} ${user.naam}`;
          activiteiten.push(nietGlobaleActiviteiten);
        }
      }

      // **Nieuw toegevoegd: Haal de leiding op voor de huidige tak**
      const leiding = await usersCollection
        .find({ tak: new RegExp(`^${tak}$`, 'i') }) // Tak filteren (case-insensitive)
        .toArray();
      console.log('Leiding gevonden voor tak:', leiding);

      // Geef het pad naar de juiste submap voor de betreffende tak
      const takViewPath = path.join(__dirname, '../views', tak);
      res.render(takViewPath, { 
        title: `${tak}`, 
        activiteiten, 
        leiding // Voeg de leiding toe aan de render
      });
      console.log(`Ophalen activiteiten ${tak}`, activiteiten);
    } catch (error) {
      console.error('Fout bij het ophalen van activiteiten of leiding:', error);
      res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten of leiding.');
    }
  });
});

module.exports = router;
