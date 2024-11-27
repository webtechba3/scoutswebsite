const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { body, validationResult } = require('express-validator');
/*router.get('/', (req, res) => {
    res.render('inschrijven');
});*/

router.get('/', async (req, res) => {
    try {
        // Ophalen van alle inschrijvingen uit de database
        const inschrijvingen = await req.app.locals.inschrijvingenCollection.find().toArray();
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
    // uncomment dit in de echte code
    const result = await req.app.locals.inschrijvingenCollection.insertOne({ naam, voornaam ,email, woonplaats });
    console.log('Ingevoegd document met ID:', result.insertedId);
    res.render('bedanktVoorInschrijving'); 
    
    
});
module.exports = router;