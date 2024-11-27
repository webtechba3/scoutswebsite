var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  console.log('Sessie:', req.session);
  res.render('index', { title: 'Sint-Martinus scouts Ieper' });
});*/
router.get('/', async (req, res, next) => {
  try {
    // Verkrijg de contactCollection uit app.locals
    const contactCollection = req.app.locals.contactCollection;

    if (!contactCollection) {
      return res.status(500).send('Contactcollectie is niet beschikbaar');
    }

    // Haal alle contactberichten op uit de database met async/await
    const contacten = await contactCollection.find().toArray();

    // Render de 'index' view met de opgehaalde contactgegevens
    res.render('index', { 
      title: 'Sint-Martinus scouts Ieper',
      contacten: contacten // Verstuur de contacten naar de view
    });
  } catch (error) {
    console.error('Fout bij ophalen van contacten:', error);
    res.status(500).send('Er is een fout opgetreden bij het ophalen van de contacten.');
  }
});

router.post('/contact', function(req, res, next) {
  const {naam, email, bericht } = req.body;
  console.log(naam, email, bericht);

  req.app.locals.contactCollection.insertOne({ naam, email, bericht });
  res.redirect('/');
});
router.get('/cookie-policy', function(req, res, next) {
  res.render('cookie-policy');
});
router.get('/privacy-policy', function(req, res, next) {
  res.render('privacy-policy');
});
router.post
module.exports = router;
