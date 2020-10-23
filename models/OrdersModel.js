// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Orders = sequelize.define('Orders', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    customerId: { // FK
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'OrderStatus',
            key: 'id'
        }
    }
})

module.exports = Orders;