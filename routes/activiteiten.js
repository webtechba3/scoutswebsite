let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('activiteiten'); // Dit rendert het `activiteiten.pug` bestand in de `views` map
});

router.post('/postactiviteit', async (req, res) => {
    const { title, message, target } = req.body;
    

    if (!title || !message || !target) {
        return res.status(400).send('Alle velden zijn verplicht.');
    }
    try {
        const activiteit = {
            title,
            message,
            createdAt: new Date()
        };
        const  voornaam= req.session.voornaam;
        const achternaam = req.session.achternaam;
        const result = await req.app.locals.activiteitenCollection.insertOne(activiteit);
        const persoon = await req.app.locals.usersCollection.findOne({voornaam : voornaam, achternaam : achternaam});   // Dit is een query om de gebruiker te vinden   
        const link = await req.app.locals.linkuseractiviteit.insertOne(persoon.id ,result.id, target );
        console.log('Activiteit toegevoegd met ID:', result.insertedId);
        res.status(200).json({ message: 'Activiteit succesvol toegevoegd', id: result.insertedId });
    } catch (error) {
        console.error('Fout bij het toevoegen van de activiteit:', error);
        res.status(500).send('Er is een fout opgetreden bij het toevoegen van de activiteit.');
    }
});

module.exports = router;