const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Country model with strict validations to prevent blanks and wrong formats
const Country = sequelize.define('Country', {
  countryid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Country name cannot be empty' }
    }
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isInt: { msg: 'Population must be an integer' } }
  },
  age_distribution: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Age distribution must be a JSON object');
        }
      }
    }
  },
  gender_ratio: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Gender ratio must be a JSON object');
        }
      }
    }
  },
  gdp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'GDP must be a decimal number' } }
  },
  average_income: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'Average income must be a decimal number' } }
  },
  unemployment_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'Unemployment rate must be a decimal number' } }
  },
  literacy_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'Literacy rate must be a decimal number' } }
  },
  life_expectancy: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'Life expectancy must be a decimal number' } }
  },
  happiness_index: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    validate: { isDecimal: { msg: 'Happiness index must be a decimal number' } }
  },
  crime_index: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: { msg: 'Crime index must be a decimal number' } }
  },
  protest_frequency: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: { notEmpty: { msg: 'Protest frequency cannot be empty' } }
  },
  political_parties: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Political parties must be a JSON object');
        }
      }
    }
  },
  terrain_features: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Terrain features must be a JSON object');
        }
      }
    }
  },
  rare_resources: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Rare resources must be a JSON object');
        }
      }
    }
  },
  cultural_features: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Cultural features must be a JSON object');
        }
      }
    }
  },
  social_groups: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Social groups must be a JSON object');
        }
      }
    }
  },
  social_media_usage: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidJSON(value) {
        if (typeof value !== 'object') {
          throw new Error('Social media usage must be a JSON object');
        }
      }
    }
  },
  government_structure: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Government structure cannot be empty' } }
  },
  media_environment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Media environment cannot be empty' } }
  }
}, {
  timestamps: false
});

module.exports = Country;

