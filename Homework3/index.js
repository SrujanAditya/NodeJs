const express = require('express');
const userRoutes = require('./controllers/users/user-controller');
const groupRoutes = require('./controllers/groups/group-controller');
const PORT = process.env.port || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./loggers/winston-logger');

const app = express();

app.use(bodyParser.json());
app.use(session({
    name: 'user',
    resave: false,
    saveUninitialized: false,
    secret: 'ssh!quiet,it\'asecret!',
    authId: null,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: true,
        sameSite: true
    }
}));

app.use((req, res, next) => {
    logger.info(`Time: ${Date.now()}`);
    logger.info(`Request url: ${req.originalUrl}`);
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    logger.info(`Request params: ${JSON.stringify(req.params)}`);
    logger.info(`Request query: ${JSON.stringify(req.query)}`);
    next();
});

app.use('/api', userRoutes);
app.use('/api', groupRoutes);


app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send('Internal Server Error');
});

process.on('unhandledRejection', (reason, p) => {
    logger.error(`${reason}, 'Unhandled Rejection at Promise', ${p}`);
    process.exit(1);
});

process.on('uncaughtException', err => {
    logger.error(`${err}, 'Uncaught Exception thrown'`);
    process.exit(1);
});

app.listen(PORT, () => logger.info(`Server is listening on port ${PORT}!`));