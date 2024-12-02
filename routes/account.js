const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
        // Dynamische naam: voornaam_achternaam_jaar_tijdstempel.extensie
        const { voornaam } = req.session;
        const { achternaam } = req.session;
        const jaar = new Date().getFullYear(); // Huidig jaar
        const tijdstempel = Date.now(); // Unieke tijdstempel
        const filename = `${voornaam}_${achternaam}_${jaar}_${tijdstempel}${path.extname(file.originalname)}`.replace(/\s+/g, '_'); // Voeg tijdstempel toe
        cb(null, filename);
    }
});

// Validatie van bestandstype en grootte
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Alleen afbeeldingen van het type JPEG, JPG, PNG of GIF zijn toegestaan!'));
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

// Toon accountpagina
router.get('/', requireLeiding, (req, res) => {
    res.render('account');
});

// Uitloggen
router.post('/logout', requireLeiding, (req, res) => {
    if (req.session) {
        delete req.session.role;
        delete req.session.voornaam;
        delete req.session.tak;
        delete req.session.achternaam;
        res.redirect('/inloggen');
    } else {
        return res.status(400).send('Geen actieve sessie gevonden.');
    }
});

// Wachtwoord wijzigen
router.post('/wijzigWachtwoord', requireLeiding, async (req, res) => {
    const { oudwachtwoord, nieuwwachtwoord } = req.body;
    const user = await req.app.locals.usersCollection.findOne({ voornaam: req.session.voornaam });

    if (user && oudwachtwoord === user.psswd) {
        await req.app.locals.usersCollection.updateOne(
            { _id: user._id },
            { $set: { psswd: nieuwwachtwoord } }
        );
        return res.status(200).json({ message: 'Wachtwoord gewijzigd.' });
    } else {
        return res.status(400).send('Ongeldig wachtwoord of gebruiker niet gevonden.');
    }
});

// **Route om afbeelding te updaten**
router.post('/updateFoto', requireLeiding, upload.single('foto'), async (req, res) => {
    try {
        console.log('Route aangeroepen: /updateFoto');
        const user = await req.app.locals.usersCollection.findOne({ voornaam: req.session.voornaam });
        if (!user) throw new Error('Gebruiker niet gevonden');

        // Verwijder de oude afbeelding als deze bestaat
        if (user.foto) {
            const oldFilePath = path.join(__dirname, '..', 'public', user.foto);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
                console.log('Oude afbeelding verwijderd:', oldFilePath);
            }
        }

        // Controleer of een nieuwe afbeelding is geüpload
        if (!req.file) throw new Error('Geen bestand geüpload');
        console.log('Nieuw bestand geüpload:', req.file);

        // Controleer opslag van het nieuwe bestand
        const newFilePath = path.join(imagePath, req.file.filename);
        if (!fs.existsSync(newFilePath)) {
            console.error('Het nieuwe bestand is niet opgeslagen:', newFilePath);
            throw new Error('Nieuwe afbeelding kon niet worden opgeslagen.');
        }

        // Sla de nieuwe afbeelding op in de database
        const fotoPath = `/images/leiding/${req.file.filename}`;
        const updateResult = await req.app.locals.usersCollection.updateOne(
            { _id: user._id },
            { $set: { foto: fotoPath } }
        );

        if (updateResult.modifiedCount === 0) {
            throw new Error('Fout bij het updaten van de database.');
        }

        console.log('Nieuwe afbeelding succesvol opgeslagen in database:', fotoPath);
        res.status(200).render('account', { message: 'Afbeelding succesvol geüpdatet.' });
    } catch (err) {
        console.error('Fout bij het updaten van afbeelding:', err.message);
        if (err instanceof multer.MulterError) {
            res.status(400).render('account', { message: 'Bestandsfout: ' + err.message });
        } else {
            res.status(500).render('account', { message: err.message });
        }
    }
});

module.exports = router;
