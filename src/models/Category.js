const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Category = db.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    // options
    modelName: 'Category',
    tableName: 'category',
    timestamps: false,
    underscore: true,
  },
);

module.exports = Category;
