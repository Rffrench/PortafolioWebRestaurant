// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderPayments = sequelize.define('OrderPayments', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    total: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    discount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    tip: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    orderId: { // FK
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    paymentTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'PaymentTypes',
            key: 'id'
        }
    }
},
    {
        freezeTableName: true // keep singular name
    }
)

module.exports = OrderPayments;