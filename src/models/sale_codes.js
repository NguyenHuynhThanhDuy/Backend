'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SaleCode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            SaleCode.hasMany(models.Product, {
                foreignKey: 'id'
            });
        }
    }
    SaleCode.init({
        name: DataTypes.STRING,
        percent: DataTypes.INTEGER(11),
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        timestamps: false
    }, {
        sequelize,
        modelName: 'SaleCode',
    });
    return SaleCode;
};