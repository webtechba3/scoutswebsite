const express = require('express');
const router = express.Router();

// Array met takkengegevens
const takken = [
  { name: "Kapoenen", slug: "kapoenen", image: "kapoenen.jpg" },
  { name: "Welpen", slug: "welpen", image: "welpen.jpg" },
  { name: "Roeland", slug: "roeland", image: "roeland.jpg" },
  { name: "Parcival", slug: "parcival", image: "parcival.jpg" },
  { name: "Givers", slug: "givers", image: "givers.jpg" },
  { name: "Jin", slug: "jin", image: "jin.jpg" },
  { name: "Leiding", slug: "leiding", image: "leiding.jpg" },
];

// Route voor de "Takken"-pagina
router.get('/', (req, res) => {
  res.render('takken', { takken });
});

// Route voor een specifieke tak
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const tak = takken.find(t => t.slug === slug);

  if (!tak) {
    return res.status(404).render('error', { message: 'Tak niet gevonden' });
  }

  res.render('tak-detail', { tak });
});

module.exports = router;
