const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const inschrijvingenCollection = req.app.locals.inschrijvingenCollection;

        // Bereken de datum van 3 maanden geleden
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        // Verwijder inschrijvingen die ouder zijn dan 3 maanden
        const result = await inschrijvingenCollection.deleteMany({ createdAt: { $lt: threeMonthsAgo } });
        console.log(`${result.deletedCount} inschrijvingen ouder dan 3 maanden verwijderd.`);

        // Haal de resterende inschrijvingen op
        const inschrijvingen = await inschrijvingenCollection.find().toArray();

        // Render de Pug-template met de inschrijvingen
        res.render('inschrijven', { inschrijvingen });
    } catch (error) {
        console.error('Fout bij ophalen van inschrijvingen:', error);
        res.status(500).send('Er is een fout opgetreden bij het ophalen van de inschrijvingen.');
    }
});

// POST-route om het signup-formulier te verwerken
router.post('/verzendSignUpForm', async (req, res) => {
    const { naam, voornaam, email, woonplaats } = req.body;

    try {
        // Voeg de inschrijving toe met een `createdAt` timestamp
        const result = await req.app.locals.inschrijvingenCollection.insertOne({
            naam,
            voornaam,
            email,
            woonplaats,
            createdAt: new Date() // Huidige datum en tijd
        });

        console.log('Ingevoegd document met ID:', result.insertedId);

        // Render een bedankpagina
        res.render('bedanktVoorInschrijving');
    } catch (error) {
        console.error('Fout bij het verwerken van de inschrijving:', error);
        res.status(500).send('Er is een fout opgetreden bij het verwerken van de inschrijving.');
    }
});

module.exports = router;
