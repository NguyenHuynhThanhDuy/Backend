'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductInventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    ProductInventory.init({
        sold: { type: DataTypes.INTEGER(11), field: 'sold' },
        amount: { type: DataTypes.INTEGER(11), field: 'amount' },
        productId: { type: DataTypes.BIGINT(11), field: 'product_id', references: 'products', referencesKey: 'id' },
        inventoryId: { type: DataTypes.BIGINT(11), field: 'inventory_id', references: 'inventories', referencesKey: 'id' },

    }, {
        sequelize,
        modelName: 'ProductInventory',
        timestamps: false,
        tableName: 'products_inventories'
    });
    return ProductInventory;
};