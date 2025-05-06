const Message = require('../models/Message');
const sequelize = require('../config/database');

const purgeOldMessages = async () => {
  try {
    await sequelize.query(`
      DELETE FROM Messages
      WHERE id NOT IN (
        SELECT id FROM Messages
        ORDER BY createdAt DESC
        LIMIT 50
      )
    `);
    console.log('Old messages purged at', new Date());
  } catch (error) {
    console.error('Purge error:', error);
  }
};

module.exports = purgeOldMessages;