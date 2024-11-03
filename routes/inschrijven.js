const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.get('/', (req, res) => {
    res.render('inschrijven'); // Dit rendert het `images.jade` bestand in de `views` map
});
router.post(
    '/verzend',
    [
        // Validate and sanitize fields
        body('naam')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Naam is required')
            .escape(),
        body('email')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),
        body('woonplaats')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Woonplaats is required')
            .escape()
    ],
    (req, res) => {
        // Find validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, re-render the form with error messages
            return res.status(400).render('inschrijven', {
                errors: errors.array(),
                data: req.body // Optionally pass the entered data back to the form
            });
        }

        // Process valid form data (e.g., save to a database)
        const { naam, email, woonplaats } = req.body;

        // Here you could insert the data into a database. For example:
        // db.query('INSERT INTO users (naam, email, woonplaats) VALUES (?, ?, ?)', [naam, email, woonplaats])

        res.send('Form submitted successfully!');
    }
);
module.exports = router;