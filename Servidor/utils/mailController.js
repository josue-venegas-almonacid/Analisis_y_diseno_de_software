const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const correoNutricionista = process.env.CORREO_NUTRICIONISTA;

//Enviar Mail a usuarios cuando admin edita la info de una consulta
exports.sendEmailUpdate = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: correoNutricionista,
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
  sgMail
  .send(mailOptions)
  .then(() => {
    console.log('Email sent')
    res.status(200).send({message: "Email enviado"})
  })
  .catch((error) => {
    console.error(error)
  })
};

//Enviar Mail a usuarios cuando el admin añade el link de una consulta
exports.sendEmailLink = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: correoNutricionista,
    to: req.email,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a " +
      req.nombreUser +
      " se ha agregado el enlace para la reunión que tienes agendada, " +
      req.body.link,
  };
  // Enviamos el email
  sgMail
  .send(mailOptions)
  .then(() => {
    console.log('Email sent')
    res.status(200).send({message: "Email enviado"})
  })
  .catch((error) => {
    console.error(error)
  })
};

//Enviar Mail al Correo del Admin cuando un usuario pospone una consulta agendada
exports.sendEmailPosponer = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: correoNutricionista,
    to: correoNutricionista,
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
  sgMail
  .send(mailOptions)
  .then(() => {
    console.log('Email sent')
    res.status(200).send({message: "Email enviado"})
  })
  .catch((error) => {
    console.error(error)
  })
};

//Enviar Mail al Correo del Admin cuando un usuario cancela una consulta agendada
exports.sendEmailCancelar = function (req, res) {
  //Definimos el mail a enviar
  var mailOptions = {
    from: correoNutricionista,
    to: correoNutricionista,
    subject: "Información Consulta ID: " + req.id_consulta,
    text:
      "Estimado/a Administrador el usuario de ID: " +
      req.user.id +
      " ha cancelado su consulta",
  };
  // Enviamos el email
  sgMail
  .send(mailOptions)
  .then(() => {
    console.log('Email sent')
    res.status(200).send({message: "Email enviado"})
  })
  .catch((error) => {
    console.error(error)
  })
};
