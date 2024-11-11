const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { body, validationResult } = require('express-validator');
router.get('/', (req, res) => {
    res.render('inschrijven');
});

// POST-route om het signup-formulier te verwerken
router.post('/verzendSignUpForm', async (req, res) => {
    
    const { naam, voornaam, email, woonplaats } = req.body;
    // uncomment dit in de echte code
    //const result = await req.app.locals.inschrijvingenCollection.insertOne({ naam, voornaam ,email, woonplaats });
    //console.log('Ingevoegd document met ID:', result.insertedId);
    res.render('bedanktVoorInschrijving'); 
    
    
});
module.exports = router;