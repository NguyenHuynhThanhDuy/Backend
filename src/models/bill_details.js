'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BillDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BillDetail.belongsTo(models.Bill, {
                foreignKey: 'id'
            });
            BillDetail.belongsTo(models.Product, {
                foreignKey: 'id'
            });
        }
    }
    BillDetail.init({
        count: DataTypes.INTEGER(11),
        price: DataTypes.INTEGER(11),
        bill_id: DataTypes.BIGINT(20),
        product_id: DataTypes.BIGINT(20),
    }, {
        sequelize,
        modelName: 'BillDetail',
    });
    return BillDetail;
};