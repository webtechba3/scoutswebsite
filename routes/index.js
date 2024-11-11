var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Scoutswebsite' });
});
router.get('/cookie-policy', function(req, res, next) {
  res.render('cookie-policy');
});
router.get('/privacy-policy', function(req, res, next) {
  res.render('privacy-policy');
});
module.exports = router;
