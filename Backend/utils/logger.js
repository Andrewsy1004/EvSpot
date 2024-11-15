
import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Crear carpeta "logs" si no existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuración del logger
export const logger = winston.createLogger({
  level: 'debug', // Cambia a 'warn' o 'error' en producción
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Mostrar en consola
    new winston.transports.File({ filename: 'logs/app.log' }), // Guardar en archivo
  ],
});

