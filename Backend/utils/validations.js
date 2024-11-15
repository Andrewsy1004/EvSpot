
import Joi from 'joi';

// Validación de variables de entorno
export const envSchema = Joi.object({
    DB_USER: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().integer().required(),
}).unknown();

// Validación de consultas SQL
// export const querySchema = Joi.object({
//     text: Joi.string().required(),
//     params: Joi.array().items(Joi.any()).required(),
// });
