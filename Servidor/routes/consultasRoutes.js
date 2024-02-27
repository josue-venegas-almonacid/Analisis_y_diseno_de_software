const router = require("express").Router();
const { consultas } = require("../models");
const { pacientes } = require("../models");
const verifySign = require("../utils/verifyToken");
const verifyRole = require("../utils/verifyRole");
const EmailCtrl = require('../utils/mailController');

//Ruta para ver todas las consultas de un usuario
router.get("/", verifySign, async (req, res) => {
  try {
    const allConsultas = await consultas.findAll({
      where: {
        id_usuario: req.user.id,
      },
    });
    if (!allConsultas)
      return res.status(400).send("No tienes consultas agendadas");
    res.status(200).send(allConsultas);
  } catch (error) {
    res.status(400).send("Error al mostrar las consultas");
  }
});

//Ruta para agendar consultas
router.put("/agendar/:id", verifySign, async (req, res) => {
  try {
    //Nos aseguramos que ingrese todos los datos
    const { id } = req.params;
    const rut_paciente = req.body.rut_paciente;
    const tipo = req.body.tipo;

    if (rut_paciente == null || tipo == null)
      return res.status(400).send("Por favor completa todos los campos");
    //Nos aseguramos que exista el paciente ingresado en el perfil del usuario
    const paciente = await pacientes.findOne({
      attributes: ["id"],
      where: {
        rut: rut_paciente,
      },
    });
    if (!paciente) return res.status(400).send("Error con el usuario del paciente");
    //Una vez que nos aseguremos, editamos la consulta existente
    await consultas.update(
      {
        id_usuario: req.user.id,
        id_paciente: paciente.id,
        rut_paciente: rut_paciente,
        tipo: tipo,
        estado: "Agendada",
        formBasic1: req.body.formBasic1,
        formBasic2: req.body.formBasic2,
        formBasic3: req.body.formBasic3,
        formBasic4: req.body.formBasic4,
        formBasic5: req.body.formBasic5,
        formBasic6: req.body.formBasic6,
        formBasic7: req.body.formBasic7,
        formBasic8: req.body.formBasic8,
        formRadio1: req.body.formRadio1,
        formRadio2: req.body.formRadio2,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Consulta agendada con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Editar fecha y hora de una consulta Agendada
router.put("/posponer/:id", verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      attributes: ["id_usuario"],
      where: {
        id: id,
        id_usuario: req.user.id,
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
    req.id_consulta = id,
    console.log("Consulta pospuesta con éxito");
    //res.status(200).send("Consulta pospuesta con éxito");
    next();
  } catch (error) {
    console.log(error);
    //res.status(400).send(error);
  }
},
EmailCtrl.sendEmailPosponer
);

//Usuario cancela una consulta agendada
router.put("/cancelar/:id",verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    //Revisamos que exista la consulta
    const consulta = await consultas.findOne({
      attributes: ["id_usuario"],
      where: {
        id: id,
        id_usuario: req.user.id,
      },
    });
    if (!consulta) return res.status(400).send("La consulta solicitada no existe");
    //Si existe entonces la cancelamos
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
    req.id_consulta = id,
    console.log("Consulta cancelada exitosamente")
    //res.status(200).send("Consulta cancelada exitosamente");
    next();
  } catch (error) {
    console.log(error);
    //res.status(400).send(error);
  }
}, EmailCtrl.sendEmailCancelar //Se hace envío del mail
);

module.exports = router;
