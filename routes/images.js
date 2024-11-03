let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('images'); // Dit rendert het `images.jade` bestand in de `views` map
});

module.exports = router;