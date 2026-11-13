"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "email", {
      allowNull: true,
      type: Sequelize.STRING,
      unique: true,
    });

    await queryInterface.addColumn("auth", "password_reset_token_hash", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("auth", "password_reset_expires_at", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("auth", "password_reset_expires_at");
    await queryInterface.removeColumn("auth", "password_reset_token_hash");
    await queryInterface.removeColumn("users", "email");
  },
};
