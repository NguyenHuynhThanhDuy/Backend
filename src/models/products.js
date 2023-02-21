'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.hasMany(models.BillDetail, {
                foreignKey: 'id'
            })
            Product.belongsTo(models.Brand, {
                foreignKey: 'id'
            })
            Product.belongsTo(models.Category, {
                foreignKey: 'id'
            })
            Product.belongsTo(models.SaleCode, {
                foreignKey: 'id'
            });
            Product.belongsToMany(models.Inventory, {
                through: 'ProductInventory'
            });
            Product.belongsToMany(models.PurchaseOrder, {
                through: 'PurchaseOrderDetail'
            });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        price: DataTypes.INTEGER(11),
        img1: DataTypes.STRING,
        img2: DataTypes.STRING,
        description: DataTypes.STRING,
        delete_at: DataTypes.DATE(6),
        brand_id: DataTypes.BIGINT(20),
        category_id: DataTypes.BIGINT(20),
        sale_code_id: DataTypes.INTEGER(11),
        warranty_period: DataTypes.INTEGER(11),
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};