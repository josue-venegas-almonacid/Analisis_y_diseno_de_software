"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pacientes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      pacientes.belongsTo(models.usuarios, {
        foreignKey: "id_usuario",
      });
      pacientes.hasMany(models.consultas, {
        foreignKey: "id_paciente",
      });
    }
  }
  pacientes.init(
    {
      rut: DataTypes.STRING,
      id_usuario: DataTypes.INTEGER,
      nombre: DataTypes.STRING,
      fecha_nacimiento: DataTypes.DATEONLY,
      peso: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "pacientes",
      timestamps: false,
    }
  );
  return pacientes;
};
