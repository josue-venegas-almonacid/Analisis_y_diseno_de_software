const router = require("express").Router();
const { pacientes } = require("../models");
const verifySign = require("../utils/verifyToken");

//Create de Wawas
router.post("/agregar", verifySign, async (req, res) => {
  try {
    //Nos aseguramos que ingrese todos los datos
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const peso = req.body.peso;

    if (rut == null || nombre == null || fecha_nacimiento == null || peso == null)
      return res.status(400).send("Por favor completa todos los campos");
    //Revisamos si el rut del paciente ingresado ya existe en la bd
    const paciente = await pacientes.findOne({
      where: {
        rut: rut,
      },
    });
    //Si existe el rut en la bd, mandamos error
    if (paciente) return res.status(400).send("Este paciente ya está registrado");
    //Si no existe, lo registramos
    const newPaciente = await pacientes.create({
      rut: req.body.rut,
      id_usuario: req.user.id,
      nombre: req.body.nombre,
      fecha_nacimiento: req.body.fecha_nacimiento,
      peso: req.body.peso,
    });
    res.status(200).send("Paciente agregado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get Info de las Wawas de un Usuario
router.get("/", verifySign, async (req, res) => {
  try {
    const userPacientes = await pacientes.findAll({
      where: {
        id_usuario: req.user.id,
      },
    });
    res.status(200).send(userPacientes);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Edit de Wawas
router.put("/editar/:id", verifySign, async (req, res) => {
  try {
    const { id } = req.params;
    //Nos aseguramos que exista el paciente
    const paciente = await pacientes.findOne({
      where: {
        id: id,
        id_usuario: req.user.id, //Si existe, primero verificamos quien lo está editando
      },
    });
    if (!paciente)
      return res
        .status(400)
        .send(
          "Paciente no existe o no tienes permiso para editar este paciente"
        );
    //Finalmente lo editamos
    await pacientes.update(
      {
        peso: req.body.peso,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Datos del paciente actualizados exitosamente");
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete de Wawas
router.delete("/eliminar/:id", verifySign, async (req, res) => {
  try {
    const { id } = req.params;
    //Revisamos que exista el paciente
    const paciente = await pacientes.findOne({
      where: {
        id: id,
      },
    });
    //Si no existe el paciente enviamos error
    if (!paciente) return res.status(400).send("Paciente no existe");
    //Si existe lo borramos
    await pacientes.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send("Paciente eliminado con éxito");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
