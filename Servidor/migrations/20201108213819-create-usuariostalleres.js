'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuariostalleres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
          as: "id_usuario",
        }
      },
      id_taller: {
        type: Sequelize.INTEGER,
        references: {
          model: "talleres",
          key: "id",
          as: "id_taller",
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuariostalleres');
  }
};