'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PurchaseOrder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PurchaseOrder.belongsTo(models.Supplier, {
                foreignKey: 'id'
            });
            PurchaseOrder.belongsTo(models.User, {
                foreignKey: 'id'
            });
            PurchaseOrder.belongsToMany(models.Product, {
                through: 'PurchaseOrderDetail'
            });
        }
    }
    PurchaseOrder.init({
        supplier_id: DataTypes.BIGINT(20),
        staff_id: DataTypes.BIGINT(20),
    }, {
        sequelize,
        modelName: 'PurchaseOrder',
    });
    return PurchaseOrder;
};