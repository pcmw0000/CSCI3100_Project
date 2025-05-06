const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
  name: { type: DataTypes.STRING(45), allowNull: false },
  population: DataTypes.INTEGER,
  age_distribution: DataTypes.JSON,
  gender_ratio: DataTypes.JSON,
  gdp: DataTypes.DECIMAL(10, 2),
  average_income: DataTypes.DECIMAL(10, 2),
  unemployment_rate: DataTypes.DECIMAL(10, 2),
  literacy_rate: DataTypes.DECIMAL(10, 2),
  life_expectanct: DataTypes.DECIMAL(10, 2),
  happiness_index: DataTypes.DECIMAL(10, 2),
  crime_index: DataTypes.DECIMAL(10, 2),
  protest_frequency: { type: DataTypes.STRING(45), allowNull: false},
  political_parties: DataTypes.JSON,
  terrain_feature: DataTypes.JSON,
  rare_resources: DataTypes.JSON,
  cultural_features: DataTypes.JSON,
  social_groups: DataTypes.JSON,
  social_media_usage: DataTypes.JSON,
  government_structure: DataTypes.TEXT,
  media_environment: DataTypes.TEXT
}, { timestamps: false });

module.exports = Country;