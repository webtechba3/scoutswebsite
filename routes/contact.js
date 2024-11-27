const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Verwerk het contactformulier
router.post('/verzendContactForm', async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: email, // Afzender
        to: 'tano.pannekoucke@gmail.com', // Jouw e-mailadres
        subject: `Nieuw bericht van ${name}`,
        text: `Je hebt een nieuw bericht ontvangen:\n\nNaam: ${name}\nE-mail: ${email}\nBericht:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail succesvol verzonden:', email);
        res.send('Bedankt voor je bericht! We nemen snel contact met je op.');
    } catch (error) {
        console.error('Fout bij het verzenden van de e-mail:', error);
        res.status(500).send('Er is een fout opgetreden bij het verzenden van het bericht.');
    }
});

module.exports = router;
