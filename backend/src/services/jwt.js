const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, countryid: user.countryid },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };