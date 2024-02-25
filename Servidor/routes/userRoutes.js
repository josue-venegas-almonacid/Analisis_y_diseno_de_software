const router = require("express").Router();
const { usuarios } = require("../models");
const { consultas } = require("../models");
const verifySign = require("../utils/verifyToken");

//Para manejar los Pacientes de cada usuario
router.use("/pacientes", require("./pacientesRoutes"));

//Ver Info Usuario
router.get("/", verifySign, async (req, res) => {
  try {
    const userInfo = await usuarios.findAll({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Editar Datos Usuario
router.put("/editar", verifySign, async (req, res) => {
  try {
    //Nos aseguramos que exista el usuario
    const usuario = await usuarios.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!usuario) return res.status(400).send("Usuario no existe");
    //Si existe lo editamos
    await usuarios.update(
      {
        numero_contacto: req.body.numero_contacto,
        email: req.body.email,
        direccion: req.body.direccion,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    res.status(200).send("Datos actualizados exitosamente");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Ver Historial de Consultas
router.get("/historial", verifySign, async (req, res) => {
  try {
    const AllConsulta = await consultas.findAll({
      where: {
        id_usuario: req.user.id,
        estado:"Finalizada"
      },
    });
    if (!AllConsulta) return res.status(400).send("Tu historial de consultas está vacío");
    res.status(200).send(AllConsulta);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
