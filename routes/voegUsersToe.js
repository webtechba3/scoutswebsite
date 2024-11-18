const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.render('voegUsersToe');
});

// POST-route om het signup-formulier te verwerken
router.post('/voegToe', async (req, res) => {
    
    const { naam, voornaam, email, wachtwoord, rol } = req.body;
    // uncomment dit in de echte code
    console.log(naam + " " + voornaam + " " + email + " " + wachtwoord + "voor hahsehn , " + rol+  " rol");
    //let psswd = await bcrypt.hash(wachtwoord, 10);
    let psswd = wachtwoord;
    console.log(psswd + " na hashen");
    const result = await req.app.locals.usersCollection.insertOne({ naam, voornaam ,email, psswd , rol});
    console.log('Ingevoegd document met ID:', result.insertedId);
    console.log( naam + " " + voornaam + " " + email + " " + wachtwoord+ rol);

    res.render('voegUsersToe', { message: 'Gebruiker met naam  '+naam + ' ' +voornaam +' toegevoegd na hashen' });
    
});
module.exports = router;