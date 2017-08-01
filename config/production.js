exports.config = {
  environment: 'production',
  isProduction: true,
  common: {
    port: process.env.PORT,
    database: {
      url: process.env.NODE_API_DB_URL,
      host: process.env.NODE_API_DB_HOST,
      port: process.env.NODE_API_DB_PORT,
      database: process.env.NODE_API_DB_NAME,
      username: process.env.NODE_API_DB_USERNAME,
      password: process.env.NODE_API_DB_PASSWORD
    },
    api: {
      bodySizeLimit: process.env.API_BODY_SIZE_LIMIT,
      parameterLimit: process.env.API_PARAMETER_LIMIT
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET,
      maxUsefulDays: process.env.MAX_USEFUL_DAYS,
      expirationDate: process.env.EXPIRATION_DATE
    },
    rollbar: {
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN
    },
    bcrypt: {
      saltRounds: process.env.SALT_ROUNDS
    },
    mailer: {
      host: process.env.NODE_MAILER_HOST,
      port: process.env.NODE_MAILER_PORT,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS
      }
    }
  }
};
