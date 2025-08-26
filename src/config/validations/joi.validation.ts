import * as Joi from 'joi';
import { CONFIG_DEFAULT } from '../config.default';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
const ENVIRONMENTS = ['local', 'development', 'prod'];

export const JoiValidationSchema = Joi.object({
  // Configuración de la aplicación
  NODE_ENV: Joi.string()
    .valid(...ENVIRONMENTS)
    .default(CONFIG_DEFAULT.app.environment),
  PORT: Joi.number().port().default(CONFIG_DEFAULT.app.port),
  ENABLE_SWAGGER: Joi.boolean().default(CONFIG_DEFAULT.app.enableSwagger),

  // Configuración de base de datos (PostgreSQL)
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().port().default(CONFIG_DEFAULT.database.port),
  DB_USERNAME: Joi.string().default(CONFIG_DEFAULT.database.username),
  DB_PASSWORD: Joi.string().default(CONFIG_DEFAULT.database.password),
  DB_DATABASE: Joi.string().default(CONFIG_DEFAULT.database.database),

  // Configuración de logging
  LOG_LEVEL: Joi.string()
    .valid(...LOG_LEVELS)
    .default(CONFIG_DEFAULT.logging.level),
});
