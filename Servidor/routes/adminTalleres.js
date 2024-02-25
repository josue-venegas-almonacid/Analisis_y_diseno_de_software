const router = require("express").Router();
const { talleres } = require("../models");

const verifySign = require("../utils/verifyToken");
const verifyRole = require("../utils/verifyRole");

//Ver todos los talleres disponibles
router.get("/", async (req, res) => {
  try {
    const allTalleres = await talleres.findAll();
    res.status(200).send(allTalleres);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Todos los talleres después de mañana
router.get("/siguientes", async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const someTalleres = await talleres.findAll({
      where: {
        fecha: {
          [Op.gt]: new Date(),
        }
      }
    });
    res.status(200).send(someTalleres);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Agregar un Taller
router.post("/agregar", async (req, res) => {
  try {
    //Revisamos si ya existe un taller en la misma fecha y hora
    const fecha_hora = await talleres.findOne({
      where: {
        fecha: req.body.fecha,
        hora: req.body.hora,
      },
    });
    if (fecha_hora)
      return res.status(400).send("Ya existe un taller en esa fecha y hora");

    //Si no existe entonces creamos el taller
    const newTaller = await talleres.create({
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      hora: req.body.hora,
      valor: req.body.valor,
      cupos: req.body.cupos,
      link: null,
    });
    res.status(200).send("Taller agregado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Eliminar un taller
router.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista el taller
    const taller = await talleres.findOne({
      where: {
        id: id,
      },
    });
    if (!taller) return res.status(400).send("El taller solicitado ya se borró o no existe");

    //Si existe lo eliminamos
    await talleres.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send("Taller eliminado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Editar el nombre, fecha, valor y cupos de un taller
router.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista el taller
    const taller = await talleres.findOne({
      where: {
        id: id,
      },
    });
    if (!taller) return res.status(400).send("El taller solicitado no existe");
    //Si existe lo editamos
    await talleres.update(
      {
        nombre:req.body.nombre,
        fecha: req.body.fecha,
        hora: req.body.hora,
        valor: req.body.valor,
        cupos: req.body.cupos,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Taller editado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Agregar el link de un taller
router.put("/addlink/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista el taller
    const taller = await talleres.findOne({
      where: {
        id: id,
      },
    });
    if (!taller) return res.status(400).send("El taller solicitado no existe");
    //Si existe lo editamos
    await talleres.update(
      {
        link: req.body.link,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Link agregado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
