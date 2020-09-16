const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASS, {
    dialect: 'mysql',
    host: process.env.DBHOST,
    port: process.env.DBPORT || 3306
});


module.exports = sequelize;