const { usuarios } = require("../models");

//Middleware que verifica los roles de los usuarios
function verifyRole(role) {
  return async (req, res, next) => {
    const user = await usuarios.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (user.rol !== role) {
      return res.status(401).send("No tienes los permisos suficientes");
    }
    next();
  };
}
module.exports = verifyRole;
