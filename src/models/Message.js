const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  username: { // Changed from userid to username
    type: DataTypes.STRING(45),
    allowNull: false
  },
  is_archived: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  timestamps: true,
  indexes: [
    {
      fields: ['createdAt'] // Add index for purge job
    }
  ]
});

module.exports = Message;