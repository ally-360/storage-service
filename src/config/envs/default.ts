import { CONFIG_DEFAULT } from '../config.default';

export const config = {
  app: {
    /**
     * Host TCP para el microservicio de Storage
     * @type {string}
     * @default 0.0.0.0
     * @example 0.0.0.0
     * @description Host en el que se ejecutará el microservicio TCP
     * @required false
     */
    host: process.env.HOST || CONFIG_DEFAULT.app.host,
    /**
     * Puerto HTTP del Gateway
     * @type {number}
     * @default 3001
     * @example 3001
     * @description Puerto en el que se ejecutará la aplicación HTTP
     * @required false
     */
    port: process.env.PORT ? Number(process.env.PORT) : CONFIG_DEFAULT.app.port,
    /**
     * Entorno de ejecución de Node.js
     * @type {string}
     * @default development
     * @example development, production, local
     * @description Determina qué configuración de entorno cargar
     */
    environment: process.env.NODE_ENV || CONFIG_DEFAULT.app.environment,
  },

  cors: {
    /**
     * Orígenes permitidos para CORS
     * @type {string}
     * @example http://localhost:3000, https://app.example.com
     * @description Lista separada por comas de orígenes permitidos para CORS
     * @required false
     */
    origin: process.env.CORS_ORIGIN?.split(','),
  },

  database: {
    /**
     * URL de conexión a la base de datos
     * @type {string}
     * @example postgresql://user:password@localhost:5432/database
     * @description String de conexión a la base de datos
     * @required false
     */
    url: process.env.DATABASE_URL,
    /**
     * Host de la base de datos
     * @type {string}
     * @example localhost, 127.0.0.1
     * @description Host de la base de datos
     * @required false
     */
    host: process.env.DB_HOST,
    /**
     * Puerto de la base de datos
     * @type {number}
     * @example 5432, 3306
     * @description Puerto de la base de datos
     * @required false
     */
    port: process.env.DB_PORT
      ? Number(process.env.DB_PORT)
      : CONFIG_DEFAULT.database.port,
    /**
     * Nombre de la base de datos
     * @type {string}
     * @example gateway_db, ally360_gateway
     * @description Nombre de la base de datos
     * @required false
     */
    name: process.env.DB_NAME,
    /**
     * Usuario de la base de datos
     * @type {string}
     * @example postgres, mysql_user
     * @description Usuario para autenticarse en la base de datos
     * @required false
     */
    username: process.env.DB_USERNAME,
    /**
     * Contraseña de la base de datos
     * @type {string}
     * @example mypassword, secret123
     * @description Contraseña para autenticarse en la base de datos
     * @required false
     */
    password: process.env.DB_PASSWORD,
    /**
     * Nombre de la base de datos
     * @type {string}
     * @example ally360_NN_service
     * @description Nombre del esquema de base de datos
     * @required false
     */
    schema: process.env.DB_SCHEMA,
  },

  logging: {
    /**
     * Nivel de logging de la aplicación
     * @type {string}
     * @default info
     * @example debug, info, warn, error
     * @description Nivel de detalle para los logs de la aplicación
     */
    level: process.env.LOG_LEVEL || CONFIG_DEFAULT.logging.level,
  },

  rateLimit: {
    /**
     * Ventana de tiempo para rate limiting en milisegundos
     * @type {number}
     * @default 60000
     * @example 60000, 300000
     * @description Ventana de tiempo para aplicar límites de tasa de requests
     */
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
      ? Number(process.env.RATE_LIMIT_WINDOW_MS)
      : CONFIG_DEFAULT.rateLimit.windowMs,
    /**
     * Máximo número de requests por ventana de tiempo
     * @type {number}
     * @default 200
     * @example 100, 500
     * @description Número máximo de requests permitidos por ventana de tiempo
     */
    maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS
      ? Number(process.env.RATE_LIMIT_MAX_REQUESTS)
      : CONFIG_DEFAULT.rateLimit.maxRequests,
  },
};
