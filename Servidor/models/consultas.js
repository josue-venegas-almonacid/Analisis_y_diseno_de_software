"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class consultas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      consultas.belongsTo(models.usuarios, {
        foreignKey: "id_usuario",
      });
      consultas.belongsTo(models.pacientes, {
        foreignKey: "id_paciente",
      });
    }
  }
  consultas.init(
    { 
      title: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      id_usuario: DataTypes.INTEGER,
      id_paciente: DataTypes.INTEGER,
      rut_paciente: DataTypes.BIGINT,
      tipo: DataTypes.STRING,
      fecha: DataTypes.DATEONLY,
      hora: DataTypes.TIME,
      link: DataTypes.STRING,
      estado: DataTypes.STRING,
      formBasic1: DataTypes.STRING,
      formBasic2: DataTypes.STRING,
      formBasic3: DataTypes.STRING,
      formBasic4: DataTypes.STRING,
      formBasic5: DataTypes.STRING,
      formBasic6: DataTypes.STRING,
      formBasic7: DataTypes.STRING,
      formBasic8: DataTypes.STRING,
      formRadio1: DataTypes.STRING,
      formRadio2: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "consultas",
      timestamps: false,
    }
  );
  return consultas;
};
