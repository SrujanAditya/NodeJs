//https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'user', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
