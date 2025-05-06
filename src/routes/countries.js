const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Country = require('../models/Country');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.countryid !== parseInt(id)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const country = await Country.findByPk(id);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    await country.update(req.body);
    res.json({ message: 'Country updated', country });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update country' });
  }
});

module.exports = router;