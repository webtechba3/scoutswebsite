const express = require('express');
const router = express.Router();
const takken = ['kapoenen', 'welpen', 'roeland', 'parcival', 'givers', 'jin'];
const path = require('path');
takken.forEach(tak => {
    router.get(`/${tak}`, (req, res) => {
      // Geef expliciet het pad naar de juiste submap bij het renderen
      const takViewPath = path.join(__dirname, '../views/tak', tak);
      res.render(takViewPath, { title: `Welkom bij de ${tak}` });
    });
  });
  
module.exports = router;