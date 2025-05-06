const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'csci3100',
  process.env.DB_USER || 'admin1',
  process.env.DB_PASSWORD || 'admin1', {
    host: process.env.DB_HOST || '59.188.174.92',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds timeout
      ...(process.env.DB_SSL === 'true' ? {
        ssl: { require: true, rejectUnauthorized: false }
      } : {})
    },
    retry: { // Add retry configuration
      max: 5,
      match: [
        /ETIMEDOUT/,
        /ECONNRESET/,
        /ECONNREFUSED/
      ]
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
);

// Add connection test
sequelize.authenticate()
  .then(() => console.log('✅ Database connection established'))
  .catch(error => console.error('❌ Database connection failed:', error.message));

module.exports = sequelize;