const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  company: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  source: {
    type: DataTypes.ENUM('website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'),
    defaultValue: 'website'
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'qualified', 'lost', 'won'),
    defaultValue: 'new'
  },
  score: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  },
  lead_value: {
    type: DataTypes.DECIMAL(10, 2)
  },
  last_activity_at: {
    type: DataTypes.DATE
  },
  is_qualified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Lead;