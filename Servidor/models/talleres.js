"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class talleres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      talleres.hasMany(models.usuariostalleres, {
        foreignKey: "id_taller",
      });
    }
  }
  talleres.init(
    {
      nombre: DataTypes.STRING,
      fecha: DataTypes.DATEONLY,
      hora: DataTypes.TIME,
      valor: DataTypes.INTEGER,
      cupos: DataTypes.INTEGER,
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "talleres",
      timestamps: false,
    }
  );
  return talleres;
};
