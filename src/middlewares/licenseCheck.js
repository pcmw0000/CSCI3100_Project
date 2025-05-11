const User = require('../models/User');
const License = require('../models/License');

// Middleware to ensure the authenticated user has a valid license
const licenseCheck = async (req, res, next) => {
  try {
    // The authenticateToken middleware should set req.user (e.g., decoded JWT payload)
    const userRecord = await User.findByPk(req.user.id);
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the license associated with the user
    const license = await License.findOne({ where: { key: userRecord.licenseKey } });
    // Check if license exists and is marked as used (active)
    if (!license || license.isUsed === false) {
      return res.status(403).json({ error: 'Invalid license' });
    }
    // If the license is a subscription type, ensure it hasn't expired
    if (
      license.type === 'subscription' && 
      license.expirationDate && 
      new Date(license.expirationDate) < new Date()
    ) {
      return res.status(403).json({ error: 'License expired' });
    }

    // License is valid – allow request to proceed
    next();
  } catch (error) {
    console.error('License check failed:', error);
    res.status(500).json({ error: 'License validation failed' });
  }
};

module.exports = licenseCheck;
