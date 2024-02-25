const nodemailer = require("nodemailer"); // email sender function

//Añadimos los datos de la cuenta que envía los correos
const servicio = "Gmail";
const correoAdministracion = "admnistracionbbymami@gmail.com"; //Correo que se encarga de enviar todos los mails
const correoAdmin = "josue.venegas@sansano.usm.cl"; //Correo de la Nutricionista que le informa de los cambios q hagan los usuarios
const passAdmin = "Zk/gd$8qJvHbOd}IW.a09%v[s>6z6N";
const transporter = nodemailer.createTransport({
  service: servicio,
  auth: {
    user: correoAdministracion,
    pass: passAdmin,
  },
});

//Enviar Mail a usuarios cuando admin edita la info de una consulta
exports.sendEmailUpdate = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: "Remitente",
    to: req.email,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a " +
      req.nombreUser +
      " el administrador actualizó la información de una consulta que agendaste, los nuevos datos son Fecha: " +
      req.body.fecha +
      ", Hora: " +
      req.body.hora,
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error);
    } else {
      console.log("Email sent");
      res.status(200).jsonp(req.body);
    }
  });
};

//Enviar Mail a usuarios cuando el admin añade el link de una consulta
exports.sendEmailLink = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: "Remitente",
    to: req.email,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a " +
      req.nombreUser +
      " se ha agregado el enlace para la reunión que tienes agendada, " +
      req.body.link,
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error);
    } else {
      console.log("Email sent");
      res.status(200).jsonp(req.body);
    }
  });
};

//Enviar Mail al Correo del Admin cuando un usuario pospone una consulta agendada
exports.sendEmailPosponer = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: "Remitente",
    to: correoAdmin,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a Administrador el usuario de ID: " +
      req.user.id +
      " ha pospuesto su consulta para el " +
      req.body.fecha +
      " a las " +
      req.body.hora,
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error);
    } else {
      console.log("Email sent");
      res.status(200).jsonp(req.body);
    }
  });
};

//Enviar Mail al Correo del Admin cuando un usuario cancela una consulta agendada
exports.sendEmailCancelar = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: "Remitente",
    to: correoAdmin,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a Administrador el usuario de ID: " +
      req.user.id +
      " ha cancelado su consulta",
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error);
    } else {
      console.log("Email sent");
      res.status(200).jsonp(req.body);
    }
  });
};
