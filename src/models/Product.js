const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Product = db.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    url_image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // options
    modelName: 'Product',
    tableName: 'product',
    timestamps: false,
    underscore: true,
  },
);

module.exports = Product;
