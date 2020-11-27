// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const MenuItemsMenuImages = require('../models/menuItemsMenuImagesModel');
const Orders = require('../models/OrdersModel');

const Tables = sequelize.define('Tables', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    customerId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    waiterId: { // FK
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

module.exports = Tables;