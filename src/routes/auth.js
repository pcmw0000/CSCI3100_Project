const express = require('express');
const router = express.Router();
const { hashPassword, verifyPassword } = require('../services/auth');
const { generateToken } = require('../services/jwt');
const User = require('../models/User');

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, countryid, role } = req.body;

    // --------------------------
    // Password complexity validation
    // --------------------------
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must contain at least 8 characters with numbers, lowercase and uppercase letters' 
      });
    }

    // --------------------------
    // Admin uniqueness check
    // --------------------------
    if (role === 'admin') {
      const adminExists = await User.findOne({ where: { role: 'admin' } });
      if (adminExists) {
        return res.status(400).json({ error: 'An admin already exists in the system' });
      }
    }

    // --------------------------
    // Manager quota validation
    // --------------------------
    if (role === 'manager') {
      const managerCount = await User.count({ 
        where: { countryid, role: 'manager' }
      });
      if (managerCount >= 5) {
        return res.status(400).json({ 
          error: 'Maximum 5 managers allowed per region' 
        });
      }
    }

    // --------------------------
    // Username uniqueness check
    // --------------------------
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // --------------------------
    // Create user
    // --------------------------
    const hashedPassword = await hashPassword(password);
    await User.create({
      username,
      password: hashedPassword,
      role,
      countryid
    });

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);

    // --------------------------
    // Error handling
    // --------------------------
    let statusCode = 500;
    let errorMessage = 'Registration failed';

    if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
      errorMessage = error.errors[0].message;
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400;
      errorMessage = 'Username already exists';
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;