// Modelo Mesas
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    reservationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    reservationTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    party: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: { // FK
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

module.exports = Reservation;