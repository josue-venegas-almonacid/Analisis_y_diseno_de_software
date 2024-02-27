# Nombre del Proyecto

Bebé & Mami

# Descripción

Aplicación web para gestionar citas de atención infantil e inscripción a talleres de orientación, mediante ReactJS, NodeJS y PostgreSQL

# Creadores

- Matías Carvajal 201873558-0
- Marcelo Gangas 201873589-2
- Josué Venegas 201873534-5

# Herramientas necesarias

Se ha comprobado el correcto funcionamiento del proyecto con las siguientes versiones:
- Git 2.42.0
- Python 2.7.18
- NodeJS 20.11.1
- NPM 10.2.4
- PostgreSQL 16.2
- Visual Studio Code 1.86.2

# Uso
1. Base de datos

1.1. Acceda a la carpeta 'Servidor'

1.2. Genere la base de datos y tablas con el comando `npm run create-database`

2. Backend
   
2.1. Acceda a la carpeta 'Servidor'
   
2.2. Instale las librerías necesarias con el comando `npm install`

2.3. Inicie el entorno de desarrollo con el comando `npm start`. Podrá acceder al recurso en `localhost:3000`

3. Frontend
   
3.1. Acceda a la carpeta 'Cliente'

3.2. Instale las librerías necesarias con el comando `npm install`

3.3. Inicie el entorno de desarrollo con el comando `npm start`. Podrá acceder al recurso en `localhost:4200`

# Notas
- Cuando se hace un cambio en una cita de atención, se envía un correo electrónico a la cuenta de la nutricionista. Si desea recibir el correo en otra cuenta debe registrarse en SendGrid, validar dicha cuenta como Sender autorizado y luego generar una nueva API Key. Reemplace los valores `SENDGRID_API_KEY` y `CORREO_NUTRICIONISTA` en el archivo '.env' con los nuevos valores para utilizar su configuración de SendGrid en el proyecto.