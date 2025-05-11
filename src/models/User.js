const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: {
      msg: 'Username must be unique'
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isStrongPassword(value) {
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)) {
          throw new Error('Password must contain 8+ characters with numbers and both cases');
        
  
        }
      }
    }
  },

// Add licenseKey field to link a user with a license key
  licenseKey: {
    type: DataTypes.STRING(19),
    allowNull: false,
    // Validate license key format on the User model as well (should match License format)
    validate: {
      isLicenseFormat(value) {
        const format = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!format.test(value)) {
          throw new Error('Invalid license key format');
      }
    }
  }
},

  role: {
    type: DataTypes.ENUM('admin', 'manager'),
    allowNull: false
  },
  countryid: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: false, // Disable automatic timestamps
  freezeTableName: true
});

module.exports = User;