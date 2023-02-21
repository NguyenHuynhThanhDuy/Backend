'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Bill.hasMany(models.BillDetail, {
                foreignKey: 'id'
            });
            Bill.belongsTo(models.User, {
                foreignKey: 'id'
            });
        }
    }
    Bill.init({
        customer_name: DataTypes.STRING,
        address: DataTypes.STRING,
        states: DataTypes.ENUM('waiting', 'accepted', 'shipping', 'delivering', 'delivered', 'cancel'),
        status: DataTypes.ENUM('unpaid', 'paid'),
        user_id: DataTypes.BIGINT(20),
        number_phone: DataTypes.STRING(11),
        shipper_id: DataTypes.BIGINT(20),
        shipping_fee: DataTypes.INTEGER(11),
    }, {
        sequelize,
        modelName: 'Bill',
    });
    return Bill;
};