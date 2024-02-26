const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/');

async function createDatabase() {
  const env = process.env.NODE_ENV || 'development';
  const config = require(__dirname + '/config/config.json')[env];
  const databaseName = config.database;

  try {
    // Verificar si la base de datos ya existe
    const result = await sequelize.query(`SELECT FROM pg_database WHERE datname = '${databaseName}'`);
    const databaseExists = result[0].length > 0;

    if (databaseExists) {
      // Si la base de datos existe, eliminarla
      await sequelize.query(`DROP DATABASE IF EXISTS ${databaseName}`);
      console.log('Base de datos existente eliminada con éxito.');
    }

    // Crear la base de datos
    await sequelize.query(`CREATE DATABASE ${databaseName}`);
    console.log('Base de datos creada con éxito.');
  } catch (error) {
    console.error('Error al crear o eliminar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

createDatabase();
