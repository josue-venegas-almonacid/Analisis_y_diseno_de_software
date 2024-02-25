const router = require("express").Router();
const { talleres } = require("../models");
const { usuarios } = require("../models");
const { usuariostalleres } = require('../models');
const verifySign = require("../utils/verifyToken");
const EmailCtrl = require('../utils/mailController');

//Ruta para ver todas los talleres que se ha inscrito un usuario
router.get("/", verifySign, async (req, res) => {
    try {
      const id_Talleres = await usuariostalleres.findAll({
        attributes : ["id_taller"],
        where: {
          id_usuario: req.user.id,
        },
      });
      if (!id_Talleres) return res.status(400).send("No te has inscrito a ningún taller");

      res.status(200).send(allConsultas);
    } catch (error) {
      res.status(400).send(error);
    }
  });