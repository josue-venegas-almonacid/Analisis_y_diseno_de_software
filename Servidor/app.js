//Importacion necesaria
const express = require("express");
const app = express();
const cors = require("cors");


//Middleware para que express entienda archivos JSON
app.use(cors());
app.use(express.json());

//Manejo de Rutas
app.use("/auth", require("./routes/authRoutes"));
app.use("/consultas", require("./routes/consultasRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/users", require("./routes/userRoutes"));

//Levantamiento del Server
app.listen(3000, () => {
  console.log("Server on port 3000");
});
