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
        deleted_at: DataTypes.DATE(6),
        number_phone: DataTypes.STRING,
        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
    }, {
        sequelize,
        modelName: 'Supplier',
        timestamps: false
    });
    return Supplier;
};