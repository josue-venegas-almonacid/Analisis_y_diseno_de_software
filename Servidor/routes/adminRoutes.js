const router = require("express").Router();

//Manejo de rutas
router.use("/consultas", require("./adminConsultas"));
router.use("/talleres", require("./adminTalleres"));


module.exports = router;
