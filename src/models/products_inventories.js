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
        sold: DataTypes.INTEGER(11),
        amount: DataTypes.INTEGER(11),
        product_id: DataTypes.BIGINT(11),
        inventory_id: DataTypes.BIGINT(11),
    }, {
        sequelize,
        modelName: 'ProductInventory',
    });
    return ProductInventory;
};