//voegUsersToe.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Map configureren voor afbeeldingen
const imagePath = path.join(__dirname, '..', 'public', 'images', 'leiding');

// Zorg ervoor dat de map bestaat
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

// Multer configureren voor bestandsuploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath); // Opslagmap voor foto's
  },
  filename: (req, file, cb) => {
    // Dynamische naam: voornaam_achternaam_jaar.extensie
    const { naam, voornaam } = req.body;
    const jaar = new Date().getFullYear(); // Huidig jaar
    const filename = `${voornaam}_${naam}_${jaar}${path.extname(file.originalname)}`.replace(/\s+/g, '_'); // Vervang spaties door underscores
    cb(null, filename);
  },
});

// Validatie van bestandstype en grootte
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/; // Toegestane bestandstypen
  const mimetype = allowedFileTypes.test(file.mimetype); // Controleer MIME-type
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()); // Controleer extensie

  if (mimetype && extname) {
    return cb(null, true); // Bestand toegestaan
  }

  cb(new Error('Bestandstype niet toegestaan! Alleen JPEG, JPG, PNG of GIF zijn toegestaan.'));
};

// Multer-instantie met limieten en validatie
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maximaal 2 MB
  fileFilter,
});

// Middleware om te controleren of de gebruiker 'leiding' is
function requireLeiding(req, res, next) {
  if (req.session.role === 'leiding') {
    return next(); // Ga door naar de volgende middleware of route-handler
  }
  res.status(403).send('Toegang geweigerd: je hebt geen rechten om deze pagina te bekijken.');
}

// Route om de gebruikerspagina weer te geven
router.get('/', requireLeiding, (req, res) => {
  res.render('voegUsersToe');
});

// POST-route om een gebruiker toe te voegen, inclusief foto
router.post('/voegToe', requireLeiding, upload.single('foto'), async (req, res) => {
  try {
    const { naam, voornaam, email, wachtwoord, tak } = req.body;

    // Controleer of alle verplichte velden zijn ingevuld
    if (!naam || !voornaam || !email || !wachtwoord || !tak || !req.file) {
      throw new Error('Alle velden zijn verplicht.');
    }

    // Controleer of er een bestand is geüpload
    if (!req.file) {
      throw new Error('Er is geen afbeelding geüpload. Upload een JPEG, JPG, PNG of GIF bestand.');
    }

    // Controleer bestandsgrootte expliciet (optioneel, omdat Multer dit al doet)
    if (req.file.size > 2 * 1024 * 1024) {
      fs.unlinkSync(req.file.path); // Verwijder het bestand direct
      throw new Error('Bestand is te groot. Maximaal toegestane grootte is 2 MB.');
    }

    // Hash het wachtwoord
    const psswd = await bcrypt.hash(wachtwoord, 10);

    // Bestandspad opslaan
    let fotoPath = `/images/leiding/${req.file.filename}`;

    // Voeg de gebruiker toe aan de database
    const result = await req.app.locals.usersCollection.insertOne({
      naam,
      voornaam,
      email,
      psswd,
      tak,
      foto: fotoPath, // Voeg het foto-pad toe
    });

    console.log('Ingevoegd document met ID:', result.insertedId);
    res.render('voegUsersToe', {
      message: `Gebruiker met naam ${voornaam} ${naam} toegevoegd.`,
    });
  } catch (err) {
    console.error(err);

    // Controleer of de fout komt door Multer of validatie
    if (err instanceof multer.MulterError) {
      res.status(400).render('voegUsersToe', { message: 'Bestandsfout: ' + err.message });
    } else if (err.message.includes('Bestandstype niet toegestaan') || err.message.includes('afbeelding geüpload') || err.message.includes('te groot')) {
      res.status(400).render('voegUsersToe', { message: err.message });
    } else {
      res.status(500).render('voegUsersToe', { message: 'Er is iets misgegaan. Probeer het opnieuw.' });
    }
  }
});

module.exports = router;
