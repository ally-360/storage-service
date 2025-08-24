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
  },

  database: {
    /**
     * @default 5432, 3306
     */
    port: 5432,
  },

  logging: {
    /**
     * @default info
     */
    level: 'info',
  },

  security: {
    /**
     * @default 3600
     */
    jwtExpiresIn: 3600,
  },

  rateLimit: {
    /**
     * @default 60000
     */
    windowMs: 60000,
    /**
     * @default 200
     */
    maxRequests: 200,
  },
};
