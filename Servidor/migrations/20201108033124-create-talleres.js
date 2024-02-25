"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("talleres", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING,
      },
      fecha: {
        type: Sequelize.DATEONLY,
      },
      valor: {
        type: Sequelize.INTEGER,
      },
      cupos: {
        type: Sequelize.INTEGER,
      },
      hora: {
        type: Sequelize.TIME,
      },
      link: {
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("talleres");
  },
};
