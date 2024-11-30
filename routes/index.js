var express = require('express');
var mongoose = require('mongoose'); // Voor ObjectId
var router = express.Router();

/* GET home page. */
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

// Route om een contactformulier te verwijderen
router.post('/verwijderContact', async (req, res) => {
    try {
        const contactId = req.body.id; // Haal het ID op van het formulier
        const contactCollection = req.app.locals.contactCollection;

        if (!contactId) {
            return res.status(400).send('Contact-ID is vereist.');
        }

        // Verwijder het contact uit de database
        const result = await contactCollection.deleteOne({ _id: new mongoose.Types.ObjectId(contactId) });
        
        if (result.deletedCount === 1) {
            console.log(`Contact met ID ${contactId} verwijderd.`);
            res.redirect('/#contact'); // Redirect terug naar de hoofdpagina
        } else {
            res.status(404).send('Contact niet gevonden.');
        }
    } catch (error) {
        console.error('Fout bij verwijderen van contact:', error);
        res.status(500).send('Er is een fout opgetreden bij het verwijderen van het contact.');
    }
});

router.post('/contact', function (req, res, next) {
  const { naam, email, bericht } = req.body;

  // Voeg de huidige datum en tijd toe
  const contact = {
      naam,
      email,
      bericht,
      createdAt: new Date() // Huidige datum en tijd
  };

  req.app.locals.contactCollection.insertOne(contact)
      .then(() => {
          console.log('Contactformulier ingediend:', contact);
          res.redirect('/'); // Redirect naar de hoofdpagina
      })
      .catch((error) => {
          console.error('Fout bij het indienen van contactformulier:', error);
          res.status(500).send('Er is een fout opgetreden bij het indienen van het contactformulier.');
      });
});


router.get('/cookie-policy', function(req, res, next) {
    res.render('cookie-policy');
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('privacy-policy');
});

module.exports = router;
