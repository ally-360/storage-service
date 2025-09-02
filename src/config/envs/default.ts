import { CONFIG_DEFAULT } from '../config.default';
import { Storage } from '../../modules/storage/entities/storage.entity';

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
     * @default 3000
     * @example 3000
     * @description Puerto en el que se ejecutará la aplicación HTTP
     * @required true
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
    /**
     * Habilitar Swagger
     * @type {boolean}
     * @default false
     * @example true, false
     * @description Habilitar Swagger para la documentación de la API
     */
    enableSwagger:
      process.env.ENABLE_SWAGGER || CONFIG_DEFAULT.app.enableSwagger,
  },

  database: {
    type: 'postgres',
    entities: [Storage],
    /**
     * Host de la base de datos
     * @type {string}
     * @example localhost, 127.0.0.1
     * @description Host de la base de datos
     * @required falses
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
    database: process.env.DB_DATABASE,
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
     * Esquema de la base de datos
     * @type {string}
     * @example public, schema1, schema2
     * @description Esquema de la base de datos
     * @required true
     */
    schema: process.env.DB_SCHEMA,
  },

  storage: {
    /**
     * Nombre del bucket
     * @type {string}
     * @example my-bucket
     * @description Nombre del bucket
     * @required true
     */
    bucketName: process.env.STORAGE_BUCKET_NAME,
    /**
     * Endpoint de la API
     * @type {string}
     * @example http://localhost:9000
     * @description Endpoint de la API
     * @required true
     */
    apiEndpoint: process.env.STORAGE_API_ENDPOINT,
    /**
     * Puerto de la API
     * @type {number}
     * @example 9000
     * @description Puerto de la API
     * @required true
     */
    port: process.env.STORAGE_PORT
      ? Number(process.env.STORAGE_PORT)
      : CONFIG_DEFAULT.storage.port,
    /**
     * Clave de acceso
     * @type {string}
     * @example minioadmin
     * @description Clave de acceso
     * @required true
     */
    accessKey: process.env.STORAGE_ACCESS_KEY,
    /**
     * Clave de secreto
     * @type {string}
     * @example minioadmin
     * @description Clave de secreto
     * @required true
     */
    secretKey: process.env.STORAGE_SECRET_KEY,
    /**
     * Usar SSL
     * @type {boolean}
     * @example true, false
     * @description Usar SSL
     * @required true
     */
    useSSL: process.env.STORAGE_USE_SSL === 'true',
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
};
