let express = require('express');
let router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals; // Verkrijg de collecties
        const activiteitenCollection = db.activiteitenCollection;
        const usersCollection = db.usersCollection; // Voeg de users collectie toe
        const linkuseractiviteit = db.linkuseractiviteit; // Voeg de linkuseractiviteit collectie toe

        // Zoek alle activiteiten waarvan de target "globaal" is
        const globaleActiviteiten = await activiteitenCollection.find({ target: 'globaal' }).toArray();

        // Voeg de naam en voornaam van de auteur toe aan elke activiteit
        for (let activiteit of globaleActiviteiten) {
            // Zoek de relatie in de linkuseractiviteit collectie op basis van de activiteitId
            const relatie = await linkuseractiviteit.findOne({ activiteitId: activiteit._id });

            if (relatie) {
                // Zoek de gebruiker op basis van de userId in de relatie
                const user = await usersCollection.findOne({ _id: relatie.userId });

                if (user) {
                    activiteit.auteur = `${user.voornaam} ${user.naam}`; // Voeg de volledige naam van de auteur toe
                } else {
                    activiteit.auteur = "Onbekend"; // Als er geen gebruiker is, zet je de auteur als "Onbekend"
                }
            } else {
                activiteit.auteur = "Onbekend"; // Als er geen relatie is, zet je de auteur als "Onbekend"
            }
        }

        // Render de 'activiteiten.pug' met de globale activiteiten
        res.render('activiteiten', { globaleActiviteiten });
    } catch (error) {
        console.error('Fout bij ophalen van activiteiten:', error);
        res.status(500).send('Er is een fout opgetreden bij het ophalen van de activiteiten.');
    }
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