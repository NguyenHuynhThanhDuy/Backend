'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
      },

      user_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens');
  }
};