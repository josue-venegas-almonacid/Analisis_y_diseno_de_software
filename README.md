# Integrantes
Matías Carvajal, 201873558-0 / Marcelo Gangas, 201873589-2 / Josué Venegas, 201873534-5

# Pasos para instalar
1. Descargar e instalar las aplicaciones necesarias (Node.js, PostgreSQL)
2. Crear una base de datos con las credenciales de Servidor/config (puede ser mediante pgAdmin o desde la consola)
3. Instalar las dependencias necesarias del servidor, abriendo la consola dentro de la carpeta Servidor y escribiendo npm install
4. Importar la base de datos con npx sequelize db:migrate
5. Iniciar el servidor con npm start
6. Instalar las dependencias necesarias del cliente, abriendo la consola dentro de la carpeta Cliente y escribiendo npm install
7. Iniciar el cliente con yarn start


# Notas
- Para ser administrador, se debe crear un usuario y luego en la base de datos cambiar el rol a "admin" (sin las comillas)
- Para recibir el correo, cambiar el valor de correoAdmin en Servidor/utils/mailController.js