const jwt = require("jsonwebtoken");

//Middleware para verificar que un usuario está logeado
function verifySign(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Por favor inicia sesión");
  try {
    const payload = jwt.verify(token, process.env.REACT_APP_Secret_token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send("Por favor inicia sesión");
  }
}
module.exports = verifySign;