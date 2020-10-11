// Modelo Categorias de items del menu
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MenuImages = sequelize.define('MenuImages', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    imagePath: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = MenuImages;