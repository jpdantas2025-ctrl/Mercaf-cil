const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize = new Sequelize({
  dialect,
  storage: process.env.DB_STORAGE,  // para sqlite
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false
});

module.exports = sequelize;