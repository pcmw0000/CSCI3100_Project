const Message = require('../models/Message');
const sequelize = require('../config/database');

const purgeOldMessages = async () => {
  try {
    await sequelize.query(`
      DELETE FROM Messages
      WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `);
    console.log('Old messages purged at', new Date());
  } catch (error) {
    console.error('Purge error:', error);
  }
};

module.exports = purgeOldMessages;