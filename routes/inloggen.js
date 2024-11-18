const express = require('express');
const router = express.Router();
const randomstringgenerator = require('crypto');
const session = require('express-session');
const bcrypt = require('bcrypt');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('inloggen');
});


router.post('/verzendInlogForm', async (req, res) => {
  console.log('Sessie:', req.session);
  const { email, password } = req.body;
  try{
    const user = await req.app.locals.usersCollection.findOne({ email });
    if (user) {
     
    // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord uit de database
    // het gewone passwoord moet niet gehashed worden, terwijl user.password wel gehashed is
    console.log(user.psswd , " user.password");
    console.log(password , " password");

    //return await bcrypt.compare( user.psswd , password);
    if (password == user.psswd){ 
      console.log("ingelogd")   //Het is nodig om naar req.session te kijken omdat de sessie alle gebruikersspecifieke gegevens bevat die je gedurende de gebruikerssessie wilt bijhouden, zoals of de gebruiker een leiding is, wat hun voornaam en achternaam zijn, of welke tak ze hebben.
      if (req.session) {
        req.session.achternaam = user.naam; // Zorg ervoor dat je username in je database hebt
        req.session.voornaam = user.voornaam;
        req.session.tak = user.tak; 
        req.session.role = "leiding" // geef die de rol van leiding
        console.log(req.session , " sessie");
        //res.locals.role = req.session ? req.session.role : null;
        
        req.session.save((err) => {
          if (err) {
            console.error("Fout bij opslaan van sessie:", err);
            res.status(500).send("Fout bij het opslaan van sessie");
          } else {
            console.log(res.locals.role , " res.locals.role");
            res.redirect('/'); // Stuur door naar een andere pagina na het instellen van de sessie
          }
        });
    }}
  }

  // userCollection is de collection van de gebruikers
}catch (error) {
  console.error("Fout bij het controleren van gebruikersgegevens:", error);
   // Fout tijdens controle
}
  
});
module.exports = router;

/*
async function checkUserCredentials(req, email, password) {
  try {
    // Zoek de gebruiker op basis van username
    const user = await req.app.locals.usersCollection.findOne({ email });

    if (!user) {
      return false; // Gebruiker niet gevonden
    }

    // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord uit de database
    // het gewone passwoord moet niet gehashed worden, terwijl user.password wel gehashed is
    console.log(user.psswd , " user.password");
    console.log(password , " password");
  
    //return await bcrypt.compare( user.psswd , password);
    return password == user.psswd;
    
  } catch (error) {
    console.error("Fout bij het controleren van gebruikersgegevens:", error);
    return false; // Fout tijdens controle
  }
}

router.post('/verzendInlogForm', async (req, res) => {
  const { email, password } = req.body;
  if (checkUserCredentials(req, email, password) === true) {
    console.log('Gebruiker ingelogd');
    const user = await req.app.locals.usersCollection.findOne({ email });
    //Het is nodig om naar req.session te kijken omdat de sessie alle gebruikersspecifieke gegevens bevat die je gedurende de gebruikerssessie wilt bijhouden, zoals of de gebruiker een leiding is, wat hun voornaam en achternaam zijn, of welke tak ze hebben.
    req.session.achternaam = user.naam; // Zorg ervoor dat je username in je database hebt
    req.session.voornaam = user.voornaam;
    req.session.tak = user.tak; 
    req.session.role = "leiding" // geef die de rol van leiding
    res.redirect('/home');
  }
  // userCollection is de collection van de gebruikers
  
});*/
module.exports = router;
