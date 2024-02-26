"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("consultas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
          as: "id_usuario",
        },
      },
      id_paciente: {
        type: Sequelize.INTEGER,
        references: {
          model: "pacientes",
          key: "id",
          as: "id_paciente",
        },
      },
      rut_paciente: {
        type: Sequelize.STRING,
      },
      tipo: {
        type: Sequelize.STRING,
      },
      fecha: {
        type: Sequelize.DATEONLY,
      },
      hora: {
        type: Sequelize.TIME,
      },
      link: {
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.STRING,
      },
      formBasic1: {
        type: Sequelize.STRING,
      },
      formBasic2: {
        type: Sequelize.STRING,
      },
      formBasic3: {
        type: Sequelize.STRING,
      },
      formBasic4: {
        type: Sequelize.STRING,
      },
      formBasic5: {
        type: Sequelize.STRING,
      },
      formBasic6: {
        type: Sequelize.STRING,
      },
      formBasic7: {
        type: Sequelize.STRING,
      },
      formBasic8: {
        type: Sequelize.STRING,
      },
      formRadio1: {
        type: Sequelize.STRING,
      },
      formRadio2: {
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("consultas");
  },
};