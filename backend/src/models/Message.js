const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  messageid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: { // Changed from userid to username
    type: DataTypes.STRING(45),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },   
}, { 
  tableName:'Chat',
  createdAt: 'create_at',
  updatedAt: false,
  timestamps: true,
  indexes: [
    {
      fields: ['createdAt'] // Add index for purge job
    }
  ]
});

module.exports = Message;