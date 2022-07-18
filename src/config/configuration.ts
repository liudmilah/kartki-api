export default () => ({
    isProdEnv: process.env.NODE_ENV === 'production',
    isDevEnv: process.env.NODE_ENV === 'development',
    isTestEnv: process.env.NODE_ENV === 'test',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost',
    database: {
        user: process.env.DB_API_USER || '',
        password: process.env.DB_API_PASSWORD || '',
    },
    mailer: {
        host: process.env.MAILER_HOST || '',
        port: process.env.MAILER_PORT || 0,
        user: process.env.MAILER_USERNAME || '',
        password: process.env.MAILER_PASSWORD || '',
        from: process.env.MAILER_FROM_EMAIL || '',
    },
    auth: {
        fbAppId: process.env.FB_APP_ID || '',
        fbAppSecret: process.env.FB_APP_SECRET || '',
        googleAppId: process.env.GOOGLE_APP_ID || '',
        googleAppSecret: process.env.GOOGLE_APP_SECRET || '',
        accessTokenTtl: 15*60,
        refreshTokenTtl: 24*60*60,
        userTokenTtl: 5*60,
    },
    jwtSecret: process.env.JWT_SECRET,
});