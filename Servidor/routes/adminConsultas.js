const router = require("express").Router();
const { consultas } = require("../models");
const { usuarios } = require('../models');

var EmailCtrl = require("../utils/mailController");
const verifySign = require("../utils/verifyToken");
const verifyRole = require("../utils/verifyRole");

//Ver todas las consultas
router.get("/", async (req, res) => {
  try {
    const allConsultas = await consultas.findAll({});
    res.status(200).send(allConsultas);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Ver todas las consultas Agendadas
router.get("/agendadas", async (req, res) => {
  try {
    const someConsultas = await consultas.findAll({
      where: {
        estado: "Agendada",
      },
    });
    res.status(200).send(someConsultas);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Todas las consultas después de mañana
router.get("/siguientes", async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const someConsultas = await consultas.findAll({
      where: {
        fecha: {
          [Op.gt]: new Date(),
        },
        estado: "Disponible",
      },
    });
    res.status(200).send(someConsultas);
  } catch (error) {
    res.status(400).send(error);
  }
});
//Ver datos de formulario de una consulta
router.get("/formulario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = await consultas.findOne({
      attributes:["formBasic1","formBasic2","formBasic3","formBasic4","formBasic5","formBasic6","formBasic7","formBasic8","formRadio1","formRadio2"],
      where: {
        id: id,
      },
    });
    if (!consulta) return res.status(400).send("La consulta solicitada no existe");
    res.status(200).send(consulta); 
  } catch (error) {
    res.status(400).send(error);
  }
});

//Ver todas las consultas disponibles en cierta fecha
router.get("/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;
    const someConsultas = await consultas.findAll({
      where: {
        fecha: fecha,
        estado: "Disponible",
      },
    });
    res.status(200).send(someConsultas);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Agregar una consulta disponible
router.post("/agregar", async (req, res) => {
  try {
    //Revisamos si ya existe una consulta en la misma fecha y hora
    const fecha_hora = await consultas.findOne({
      where: {
        fecha: req.body.fecha,
        hora: req.body.hora,
      },
    });
    if (fecha_hora)
      return res.status(400).send("Ya existe una consulta en esa fecha y hora");
    //Si no existe entonces creamos la consulta
    const newConsulta = await consultas.create({
      title: "Consulta",
      start: req.body.start,
      end: req.body.end,
      id_usuario: null,
      rut_paciente: null,
      tipo: null,
      fecha: req.body.fecha,
      hora: req.body.hora,
      link: null,
      estado: "Disponible",
    });
    res.status(200).send("Consulta Agregada con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Eliminar una consulta disponible
router.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      where: {
        id: id,
      },
    });
    if (!consulta)
      return res
        .status(400)
        .send("La consulta solicitada no existe");
    //Si existe la eliminamos
    await consultas.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send("Consulta eliminada con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Editar fecha y hora de una consulta disponible
router.put("/editar/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      //Revisamos que exista la consulta
      const consulta = await consultas.findOne({
        attributes: ["id_usuario","estado"],
        where: {
          id: id,
        },
      });
      if (!consulta) return res.status(400).send("La consulta solicitada no existe");
      //Si existe la editamos
      await consultas.update(
        {
          start: req.body.start,
          end: req.body.end,
          fecha: req.body.fecha,
          hora: req.body.hora,
        },
        {
          where: {
            id: id,
          },
        }
      );
      //Obtenemos el email y nombre del usuario inscrito en la consulta para enviarle un correo
      if(consulta.estado == "Agendada") {
        const usuario = await usuarios.findOne({
          attributes: ["nombre","email"],
          where: {
          id: consulta.id_usuario,
          },
        });
        req.id_consulta = id;
        req.nombreUser = usuario.nombre;
        req.email = usuario.email;
        next();
      };
      console.log("Consulta editada")
      //res.status(200).send("Consulta editada");
    } catch (error) {
      console.log(error);
      //res.status(400).send(error);
    }
  },
  EmailCtrl.sendEmailUpdate
);

//Admin da por finalizada una consulta
router.put("/finalizar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      where: {
        id: id,
      },
    });
    if (!consulta)
      return res.status(400).send("La consulta solicitada no existe");
    //Si existe entonces la damos por finalizada
    await consultas.update(
      {
        estado: "Finalizada",
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Consulta finalizada exitosamente");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Admin cancela una consulta
router.put("/cancelar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      where: {
        id: id,
      },
    });
    if (!consulta)
      return res.status(400).send("La consulta solicitada no existe");
    //Si existe entonces la damos por finalizada
    await consultas.update(
      {
        start: null,
        end: null,
        id_usuario: null,
        id_paciente: null,
        rut_paciente: null,
        tipo: null,
        link: null,
        estado: "Disponible",
        formBasic1: null,
        formBasic2: null,
        formBasic3: null,
        formBasic4: null,
        formBasic5: null,
        formBasic6: null,
        formBasic7: null,
        formBasic8: null,
        formRadio1: null,
        formRadio2: null,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Consulta cancelada exitosamente");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Agregar el link de una consulta
router.put("/addlink/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      attributes: ["id_usuario"],
      where: {
        id: id,
      },
    });
    if (!consulta) return res.status(400).send("La consulta solicitada no existe");
    //Obtenemos el email y nombre del usuario inscrito en la consulta para enviarle un correo
    const usuario = await usuarios.findOne({
      attributes: ["nombre","email"],
      where: {
      id: consulta.id_usuario,
    },
    });
    req.id_consulta = id;
    req.nombreUser = usuario.nombre;
    req.email = usuario.email;
    //Si existe lo editamos
    await consultas.update(
      {
        link: req.body.link,
      },
      {
        where: {
          id: id,
        },
      }
    );
    console.log("Link agregado con éxito");
    //res.status(200).send("Link agregado con éxito");
    next();
  } catch (error) {
    console.log(error);
    //res.status(400).send(error);
  }
}, EmailCtrl.sendEmailLink);

module.exports = router;
