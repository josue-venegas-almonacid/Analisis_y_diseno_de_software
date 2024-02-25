const router = require("express").Router();
const { usuarios } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifySign = require("../utils/verifyToken");
const verifyRole = require("../utils/verifyRole");

require("dotenv").config();

//Registro
router.post("/register", async (req, res) => {
  //Se revisa si el mail ingresado ya esta registrado
  try {
    const emailValid = await usuarios.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailValid) return res.status(400).send("El email ingresado ya existe");
    //Método de encriptacion para la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.contraseña, salt);

    //Se crea el usuario
    const user = await usuarios.create({
      nombre: req.body.nombre,
      contraseña: hashPass,
      numero_contacto: req.body.numero_contacto,
      email: req.body.email,
      direccion: req.body.direccion,
      rol: "basico",
    });
    return res.send("Registro Exitoso");
  } catch (error) {
    return res.status(400).send(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await usuarios.findOne({
      where: {
        email: req.body.email,
      },
    });
    //Revisamos si existe o no el usuario
    if (!user) return res.status(400).send("Usuario o contraseña equivocados");
    //Comprobamos la contraseña
    const validPass = await bcrypt.compare(
      req.body.contraseña,
      user.contraseña
    );
    if (!validPass)
      return res.status(400).send("Usuario o contraseña equivocados");
    //Creamos un token con JSON Web Token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN);
    //Enviamos el token
    return res.send(token);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//Registro de Admins, solo un admin puede registrar a otro
router.post("/registerAdmin", async (req, res) => {
  try {
    const emailValid = await usuarios.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailValid) return res.status(400).send("El email ingresado ya existe");
    //Método de encriptacion para la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.contraseña, salt);

    //Se crea el usuario
    const user = await usuarios.create({
      nombre: req.body.nombre,
      contraseña: hashPass,
      numero_contacto: req.body.numero_contacto,
      email: req.body.email,
      direccion: req.body.direccion,
      rol: "admin",
    });
    return res.send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//Exportamos el router
module.exports = router;
