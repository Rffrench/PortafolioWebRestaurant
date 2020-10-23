// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderDetails = sequelize.define('OrderDetails', {
    menuItemId: { // FK PK
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
            model: 'MenuItems',
            key: 'id'
        }
    },
    orderId: { // FK PK
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
            model: 'Orders',
            key: 'id',

        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = OrderDetails;