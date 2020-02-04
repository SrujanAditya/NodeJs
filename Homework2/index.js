const express = require('express');
const userRoutes = require('./userRoutes/users');
const PORT = process.env.port || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
userRouter.use(session({
    name: 'user',
    resave: false,
    saveUninitialized: false,
    secret: 'ssh!quiet,it\'asecret!',
    cookie: {
        maxAge: 1000*60*60,
        secure: true,
        sameSite: true
    }
}))

app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`);
    console.log(`Request url: ${req.originalUrl}`);
    next();
});

app.use('/api', userRoutes);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));