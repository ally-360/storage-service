export const CONFIG_DEFAULT = {
  app: {
    /**
     * @default 3001
     */
    port: 3001,
    /**
     * @default localhost
     */
    host: 'localhost',
    /**
     * @default development
     */
    environment: 'development',
    /**
     * @default false
     */
    enableSwagger: false,
  },

  database: {
    /**
     * @default 5432
     */
    port: 5432,
    /**
     * @default storage_service
     */
    schema: 'storage_service',
    /**
     * @default postgres
     */
    username: 'postgres',
    /**
     * @default postgres
     */
    password: 'postgres',
    /**
     * @default master
     */
    database: 'master',
    /**
     * @default false
     */
    ssl: false,
  },

  logging: {
    /**
     * @default info
     */
    level: 'info',
  },
};
