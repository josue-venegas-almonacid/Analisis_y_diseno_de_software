"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usuariostalleres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      usuariostalleres.belongsTo(models.usuarios, {
        foreignKey: "id_usuario",
      });
      usuariostalleres.belongsTo(models.talleres, {
        foreignKey: "id_taller",
      });
    }
  }
  usuariostalleres.init(
    {
      id_usuario: DataTypes.INTEGER,
      id_taller: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "usuariostalleres",
      timestamps: false,
    }
  );
  return usuariostalleres;
};
