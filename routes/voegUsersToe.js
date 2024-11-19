const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
function requireLeiding(req, res, next) {
    if (req.session.role === 'leiding') {
      return next(); // Ga door naar de volgende middleware of route-handler
    }
    res.status(403).send('Toegang geweigerd: je hebt geen rechten om deze pagina te bekijken.');
  }
router.get('/',requireLeiding, (req, res) => {
    res.render('voegUsersToe');
});

// POST-route om het signup-formulier te verwerken
router.post('/voegToe',requireLeiding, async (req, res) => {
    
    const { naam, voornaam, email, wachtwoord, tak } = req.body;
    // uncomment dit in de echte code
    console.log(naam + " " + voornaam + " " + email + " " + wachtwoord + "voor hahsehn , " + tak+  " tak");
    //let psswd = await bcrypt.hash(wachtwoord, 10);
    let psswd = wachtwoord;
    console.log(psswd + " na hashen");
    const result = await req.app.locals.usersCollection.insertOne({ naam, voornaam ,email, psswd , tak});
    console.log('Ingevoegd document met ID:', result.insertedId);
    console.log( naam + " " + voornaam + " " + email + " " + wachtwoord+ tak);

    res.render('voegUsersToe', { message: 'Gebruiker met naam  '+naam + ' ' +voornaam +' toegevoegd na hashen' });
    
});
module.exports = router;