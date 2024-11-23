let express = require('express');
let router = express.Router();
const { ObjectId } = require('mongodb'); 

router.get('/', (req, res) => {
    res.render('activiteiten'); // Dit rendert het `activiteiten.pug` bestand in de `views` map
});

router.post('/postactiviteit', async (req, res) => {
    const { title, message, target } = req.body;
    

    if (!title || !message || !target) {
        return res.status(400).send('Alle velden zijn verplicht.');
    }

    try {
        const db = req.app.locals; // Verkrijg de collecties
        const usersCollection = db.usersCollection;
        const activiteitenCollection = db.activiteitenCollection;
        const linkuseractiviteit = db.linkuseractiviteit;

        // 1. Zoek de gebruiker op basis van voornaam en achternaam
       
        const user = await usersCollection.findOne({ voornaam: req.session.voornaam/*, naam: req.session.naam*/ });
        if (!user) {
            return res.status(404).send('Gebruiker niet gevonden.');
        }

        // 2. Voeg de activiteit toe aan de `activiteiten` collectie
        const activiteit = {
            title,
            message,
            target,
            createdAt: new Date()
        };

        const activiteitResult = await activiteitenCollection.insertOne(activiteit);
        console.log('Activiteit toegevoegd met ID:', activiteitResult.insertedId);

        // 3. Voeg een relatie toe aan de `linkuseractiviteit` collectie
        const relatie = {
            userId: user._id, // ID van de gebruiker
            activiteitId: activiteitResult.insertedId, // ID van de activiteit
            target,
            createdAt: new Date() // Timestamp van relatie
        };

        const linkResult = await linkuseractiviteit.insertOne(relatie);
        console.log('Relatie toegevoegd met ID:', linkResult.insertedId);

        // Stuur een succesvolle redirect of JSON-response
        res.redirect('/activiteiten');
    } catch (error) {
        console.error('Fout bij het verwerken van de activiteit:', error);
        res.status(500).send('Er is een fout opgetreden bij het verwerken van de activiteit.');
    }
});


module.exports = router;