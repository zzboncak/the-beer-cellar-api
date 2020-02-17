module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    JWT_SECRET: 'beer-cellar-token',
    CLIENT_ORIGIN: ['https://the-beer-cellar-app-1q5d2qv3q.now.sh', 'http://localhost:3000', 'https://the-beer-cellar-app.now.sh'],
};