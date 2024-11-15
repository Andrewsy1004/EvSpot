
import pkg from 'pg';
import dotenv from 'dotenv';
import { envSchema, logger } from '../utils/index.js'; 

dotenv.config();
const { Pool } = pkg;

// Validar las variables de entorno
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  logger.error(`Configuración de entorno inválida: ${error.message}`);
  throw new Error(`Configuración de entorno inválida: ${error.message}`);
}

// Crear el pool con las variables validadas
const pool = new Pool({
  user: envVars.DB_USER,
  host: envVars.DB_HOST,
  database: envVars.DB_DATABASE,
  password: envVars.DB_PASSWORD,
  port: parseInt(envVars.DB_PORT, 10),
});

// Método para conectar y obtener un cliente
export const connect = async () => {
  try {
    const client = await pool.connect();
    logger.info("Conexión a la base de datos abierta");
    return client;
  } catch (err) {
    logger.error(`Error al conectar a la base de datos: ${err.message}`);
    throw err;
  }
};

// Método para desconectar
export const disconnect = async (client) => {
  try {
    await client.release();
    logger.info("Conexión a la base de datos cerrada");
  } catch (err) {
    logger.error(`Error al cerrar la conexión: ${err.message}`);
    throw err;
  }
};

// Método para realizar consultas SQL
export const query = async (text, params) => {
  const client = await connect();
  try {
    logger.debug(`Ejecutando consulta: ${text} con parámetros ${JSON.stringify(params)}`);
    const res = await client.query(text, params);
    logger.info("Consulta ejecutada con éxito");
    return res;
  } catch (err) {
    logger.error(`Error al ejecutar la consulta: ${err.message}`);
    throw err;
  } finally {
    await disconnect(client);
  }
};

export default pool;
