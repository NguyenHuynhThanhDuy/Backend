'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Bill, {
        foreignKey: 'id'
      });
      User.hasMany(models.PurchaseOrder, {
        foreignKey: 'id'
      });
    }
  }
  User.init({
    email: DataTypes.STRING,
    hashed_password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    birthday: DataTypes.DATE,
    number_phone: DataTypes.STRING,
    verify: DataTypes.TINYINT,
    created_at: DataTypes.DATE(6),
    updated_at: DataTypes.DATE(6),
    deleted_at: DataTypes.DATE(6),
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};