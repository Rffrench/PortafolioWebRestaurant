// Modelo Categorias de items del menu
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MenuCategories = sequelize.define('MenuCategories', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING(25),
        allowNull: false
    }
})

module.exports = MenuCategories;