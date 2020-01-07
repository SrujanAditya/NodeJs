const express = require('express');
const userRoutes = require('./userRoutes/users');
const PORT = process.env.port || 3000;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    console.log(`Time: ${Date.now()}`);
    console.log(`Request url: ${req.originalUrl}`);
    next();
});

app.use('/api',userRoutes);

app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}!`));