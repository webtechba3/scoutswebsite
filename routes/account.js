let express = require('express');
let router = express.Router();
function requireLeiding(req, res, next) {
    if (req.session.role === 'leiding') {
        return next(); // Ga door naar de volgende middleware of route-handler
    }
    res.status(403).send('Toegang geweigerd: je hebt geen rechten om deze pagina te bekijken.');
}

router.get('/', requireLeiding , (req, res) => {
    res.render('account');
});

router.post('/logout',requireLeiding ,(req, res) => {
    if (req.session) {
        // Verwijder specifike sessiegegevens
        console.log('Uitloggen:', req.session.voornaam);
        delete req.session.role;
        delete req.session.voornaam;
        delete req.session.tak;
        delete req.session.achternaam;
        return res.status(200).send('Sessiegegevens verwijderd.');
    } else {
        console.error('Sessie niet beschikbaar');
        return res.status(400).send('Geen actieve sessie gevonden.');
    }
});

router.post('/wijzigWachtwoord',requireLeiding,  async (req, res) => {   
    console.log("/wijzigWachtwoord");
    const { oudwachtwoord , nieuwwachtwoord} = req.body; 
    if (req.session) {
        console.log('Wachtwoord wijzigen:', req.session.voornaam);
        console.log('Nieuw wachtwoord:', req.body.wachtwoord);
        const user = await req.app.locals.usersCollection.findOne({ voornaam :req.session.voornaam, achternaam: req.session.achternaam },{});
        if (user) {
     
            // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord uit de database
            // het gewone passwoord moet niet gehashed worden, terwijl user.password wel gehashed is
            console.log(user.psswd , " user.password");
            console.log(oudwachtwoord , " password");
        
            //return await bcrypt.compare( user.psswd , password);
            if (oudwachtwoord== user.psswd){ 
                await req.app.locals.usersCollection.updateOne(
                    { _id: user._id }, // Zoek de gebruiker op basis van hun ID
                    { $set: { psswd: hashedNieuwWachtwoord } } // Zet het nieuwe gehashte wachtwoord
                );
                console.log('Wachtwoord gewijzigd voor:', req.session.voornaam);
                return res.status(200).json({ message: 'Wachtwoord gewijzigd.' });
            } else {
                console.error('Ongeldig wachtwoord');
                return res.status(400).send('Ongeldig wachtwoord');
            } 

        } else {
            console.error('Gebruiker niet gevonden');
            return res.status(400).send('Gebruiker niet gevonden');
        }
    } else {
        console.error('Sessie niet beschikbaar');
        return res.status(400).send('Geen actieve sessie gevonden.');
    }

});

module.exports = router;
