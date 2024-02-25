"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      usuarios.hasMany(models.pacientes, {
        foreignKey: "id_usuario",
      });
      usuarios.hasMany(models.consultas, {
        foreignKey: "id_usuario",
      });

      usuarios.hasMany(models.usuariostalleres, {
        foreignKey: "id_usuario",
      });
    }
  }
  usuarios.init(
    {
      nombre: DataTypes.STRING,
      contraseña: DataTypes.STRING,
      numero_contacto: DataTypes.INTEGER,
      email: DataTypes.STRING,
      direccion: DataTypes.STRING,
      rol: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "usuarios",
      timestamps: false,
    }
  );
  return usuarios;
};
