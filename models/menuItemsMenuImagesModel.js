// Modelo Tabla items del menu
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MenuItemsMenuImages = sequelize.define('MenuItemsMenuImages', {
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
    menuImageId: { // FK PK
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
            model: 'MenuImages',
            key: 'id',

        }
    }
})


module.exports = MenuItemsMenuImages;