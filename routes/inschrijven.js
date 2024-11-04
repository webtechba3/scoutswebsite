const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
let message = "";

router.get('/', (req, res) => {
    res.render('inschrijven');
});

// POST-route om het signup-formulier te verwerken
router.post('/verzendSignUpForm', (req, res) => {
    
    const { naam, email, woonplaats } = req.body;

    // Hier kun je de logica toevoegen om de gegevens te verwerken, zoals validatie of opslag in een database.
    console.log('Ontvangen gegevens:', { naam, email, woonplaats });
    // Voorbeeldvalidatie (aanpassen indien nodig)
    if (!naam || !email || !woonplaats) {
        return res.render('inschrijven', { message: 'Alle velden zijn verplicht.' });
    }
   
    // Optioneel: sla de gebruiker op in de database (als je een database gebruikt)
    // const newUser = new User({ naam, email, woonplaats });
    // newUser.save()
    //     .then(() => res.status(201).json({ message: 'Gebruiker succesvol geregistreerd!' }))
    //     .catch(err => res.status(500).json({ message: 'Er is een fout opgetreden.', error: err }));

    // Voor nu, laten we een succesbericht terugsturen
    res.render('inschrijven', { message: 'sign up gelukt' }); // dit zorgt ervoor dat alles gecleared wordt
    
    
});
module.exports = router;