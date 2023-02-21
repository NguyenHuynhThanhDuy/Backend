'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Inventory.belongsToMany(models.Product, {
                through: 'ProductInventory'
            });
        }
    }
    Inventory.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        delete_at: DataTypes.DATE(6),
    }, {
        sequelize,
        modelName: 'Inventory',
    });
    return Inventory;
};