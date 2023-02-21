'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Supplier.hasMany(models.PurchaseOrder, {
                foreignKey: 'id'
            });
        }
    }
    Supplier.init({
        name: DataTypes.STRING,
        percent: DataTypes.INTEGER(11),
        delete_at: DataTypes.DATE(6),
        number_phone: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Supplier',
    });
    return Supplier;
};