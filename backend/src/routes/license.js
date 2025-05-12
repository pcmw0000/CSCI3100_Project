// src/routes/license.js
const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const License = require('../models/License');
const router  = express.Router();

const upload = multer({ dest: 'tmp/' });

// Anyone (or only authenticated users) can POST a license file to extract keys
router.post(
  '/upload', 
  // optionally: authenticateToken, 
  upload.single('file'),
  async (req, res) => {
    try {
      const content = fs.readFileSync(req.file.path, 'utf8');
      fs.unlinkSync(req.file.path);
      // assume one key per line
      const keys = content
        .split(/\r?\n/)
        .map(k => k.trim())
        .filter(k => k);
      // find those still unused
      const valid = await License.findAll({
        where: { key: keys, isUsed: false }
      });
      return res.json({ validKeys: valid.map(l => l.key) });
    } catch (err) {
      return res.status(500).json({ error: 'License file parsing failed' });
    }
  }
);

module.exports = router;
