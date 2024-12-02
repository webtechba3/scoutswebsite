const express = require('express');
const router = express.Router();
const randomstringgenerator = require('crypto');
const session = require('express-session');
const bcrypt = require('bcrypt');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('inloggen');
});

function requireCookies(req, res, next) {
  const cookieConsent = req.cookies.cookie_consent;
  if (cookieConsent === 'all' || cookieConsent === 'essential') {
    return next(); // Ga door naar de volgende middleware of route-handler
  }
  res.status(403).send('Toegang geweigerd: je moet cookies toestaan om in te loggen.');
}

router.post('/verzendInlogForm', requireCookies, async (req, res) => {
  console.log('Sessie:', req.session);
  const { email, password } = req.body;
  try {
    const user = await req.app.locals.usersCollection.findOne({ email });
    if (user) {
      console.log(user.psswd, " user.password in database");
      console.log(password, " ingevoerd wachtwoord");
      
      // Gebruik bcrypt.compare om het ingevoerde wachtwoord te vergelijken met de gehashte waarde
      const isMatch = await bcrypt.compare(password, user.psswd);
      if (isMatch) {
        console.log("Ingelogd"); 
        if (req.session) {
          req.session.achternaam = user.naam;
          req.session.voornaam = user.voornaam;
          req.session.tak = user.tak; 
          req.session.role = "leiding";
          console.log(req.session, " sessie");
          
          req.session.save((err) => {
            if (err) {
              console.error("Fout bij opslaan van sessie:", err);
              res.status(500).send("Fout bij het opslaan van sessie");
            } else {
              res.redirect('/'); // Stuur door naar een andere pagina
            }
          });
        }
      } else {
        res.status(401).send("Ongeldige gebruikersnaam of wachtwoord");
      }
    } else {
      res.status(401).send("Gebruiker niet gevonden");
    }
  } catch (error) {
    console.error("Fout bij het controleren van gebruikersgegevens:", error);
    res.status(500).send("Er is iets fout gegaan");
  }
});

module.exports = router;