// Modelo Tabla items del menu
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MenuItems = sequelize.define('MenuItems', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    categoryId: { // FK
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'MenuCategories',
            key: 'id'
        }
    }
})


module.exports = MenuItems;