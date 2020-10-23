// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const PaymentTypes = sequelize.define('PaymentTypes', {
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
},
    {
        freezeTableName: true // keep singular name
    }
)

module.exports = PaymentTypes;