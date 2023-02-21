'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PurchaseOrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    PurchaseOrderDetail.init({
        count: DataTypes.INTEGER(11),
        price: DataTypes.INTEGER(11),
        purchase_order_id: DataTypes.BIGINT(20),
        product_id: DataTypes.BIGINT(20),
    }, {
        sequelize,
        modelName: 'PurchaseOrderDetail',
    });
    return PurchaseOrderDetail;
};