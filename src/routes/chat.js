const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Message = require('../models/Message'); // Direct import
const User = require('../models/User'); // Direct import

router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.findAll({
      limit: 50,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username'] }] // Include username
    });
    res.json(messages);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;