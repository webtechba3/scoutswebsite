const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('inloggen');
});
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
  
    return await bcrypt.compare( user.psswd , password);
    //return password === user.password;
    
  } catch (error) {
    console.error("Fout bij het controleren van gebruikersgegevens:", error);
    return false; // Fout tijdens controle
  }
}

router.post('/verzendInlogForm', async (req, res) => {
  const { email, password } = req.body;
  if (checkUserCredentials(req, email, password) === true) {
    console.log('Gebruiker ingelogd');
  }
  // userCollection is de collection van de gebruikers
  
});
module.exports = router;
