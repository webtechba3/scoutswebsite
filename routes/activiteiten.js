let express = require('express');
let router = express.Router();
router.get('/', (req, res) => {
    res.render('activiteiten'); // Dit rendert het `images.jade` bestand in de `views` map
});

module.exports = router; // Dit exporteert de router zodat we deze kunnen gebruiken in `app.js`