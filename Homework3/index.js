const express = require('express');
const userRoutes = require('./controllers/users/user-controller');
const groupRoutes = require('./controllers/groups/group-controller');
const bodyParser = require('body-parser');
// const session = require('express-session');
const logger = require('./loggers/winston-logger');
require("dotenv").config();
const PORT = process.env.PORT;

const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    logger.info(log);
    console.log(log);
    next();
  };

var cors = require('cors');

const app = express();

var whitelist = ['http://localhost:4200', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(bodyParser.json());
// app.use(session({
//     name: 'user',
//     resave: false,
//     saveUninitialized: false,
//     secret: 'ssh!quiet,it\'asecret!',
//     authId: null,
//     cookie: {
//         maxAge: 1000 * 60 * 60,
//         secure: true,
//         sameSite: true
//     }
// }));

app.use(demoLogger);

app.use((req, res, next) => {
    logger.info(`Time: ${Date.now()}`);
    logger.info(`Request url: ${req.originalUrl}`);
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    logger.info(`Request params: ${JSON.stringify(req.params)}`);
    logger.info(`Request query: ${JSON.stringify(req.query)}`);
    next();
});

app.use('/api',cors(corsOptions), userRoutes);
app.use('/api',cors(corsOptions), groupRoutes);


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

module.exports = app;