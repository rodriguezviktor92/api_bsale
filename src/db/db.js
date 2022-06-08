const { Sequelize } = require('sequelize');
// prettier-ignore
const {
  host,
  database,
  user,
  password,
} = require('../config');

const db = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
});

module.exports = db;
