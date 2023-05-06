'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      token.belongsTo(models.User, {
        foreignKey: 'id'
      })
    }
  }
  token.init({
    token: DataTypes.STRING,
    expiredAt: { type: DataTypes.DATE, field: 'expired_at' },
    userId: { type: DataTypes.BIGINT, field: 'user_id' },
    type: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
  }, {
    sequelize,
    modelName: 'token',
    tableName: 'tokens',
    timestamps: false,
  });
  return token;
};