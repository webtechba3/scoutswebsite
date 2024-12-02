const express = require('express');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Array van takken
const takken = ['kapoenen', 'welpen', 'roeland', 'parcival', 'givers', 'jin', 'leiding'];
const baseImagePath = path.join(__dirname, '..', 'public', 'images', 'leiding');
const defaultFotoPath = '/images/leiding/default_leider.webp';

takken.forEach(tak => {
  router.get(`/${tak}`, async (req, res) => {
    try {
      const db = req.app.locals; // Verkrijg de collecties
      const activiteitenCollection = db.activiteitenCollection;
      const usersCollection = db.usersCollection;
      const linkuseractiviteit = db.linkuseractiviteit;

      let activiteiten = [];
      const relaties = await linkuseractiviteit.find({ target: 'nietglobaal' }).toArray();

      if (!relaties.length) {
        return res.status(404).send('Geen activiteiten gevonden.');
      }

      for (let relatie of relaties) {
        const nietGlobaleActiviteiten = await activiteitenCollection.findOne({ _id: relatie.activiteitId });
        if (!nietGlobaleActiviteiten) continue;

        const user = await usersCollection.findOne({ _id: relatie.userId });
        if (!user) continue;

        if (
          nietGlobaleActiviteiten.target &&
          user.tak &&
          tak &&
          nietGlobaleActiviteiten.target.toLowerCase() === 'nietglobaal' &&
          user.tak.toLowerCase() === tak.toLowerCase()
        ) {
          nietGlobaleActiviteiten.auteur = `${user.voornaam} ${user.naam}`;
          activiteiten.push(nietGlobaleActiviteiten);
        }
      }

      // Haal de leiding op voor de huidige tak
      const leiding = await usersCollection
        .find({ tak: new RegExp(`^${tak}$`, 'i') })
        .toArray();

      // Controleer of de afbeelding fysiek bestaat, anders standaardfoto gebruiken
      const leidingMetFoto = leiding.map(lid => {
        const fotoPad = lid.foto ? path.join(baseImagePath, path.basename(lid.foto)) : null;
        const fotoBestaat = fotoPad && fs.existsSync(fotoPad);

        return {
          ...lid,
          foto: fotoBestaat ? lid.foto : defaultFotoPath, // Gebruik standaardfoto als originele foto niet bestaat
        };
      });

      // Geef het pad naar de juiste submap voor de betreffende tak
      const takViewPath = path.join(__dirname, '../views', tak);
      res.render(takViewPath, { 
        title: `${tak}`, 
        activiteiten, 
        leiding: leidingMetFoto // Voeg de leiding toe aan de render
      });
    } catch (error) {
      console.error('Fout bij het ophalen van activiteiten of leiding:', error);
      res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten of leiding.');
    }
  });
});

module.exports = router;
