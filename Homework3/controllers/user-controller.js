const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const Joi = require('joi');
// const {createUser} = require('../data-access/user-data-access');

const userRouter = express.Router();

const userSchema = Joi.object().keys({
    id: Joi.string().required(),
    login: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required()
});



let users = [{
    "id": "000",
    "login": "admin@gmail.com",
    "password": "$2b$10$wQ9iytzxUb/2QnVmOBJ3WuN9bsVgvkqG7nnoqtP5peSpJE1eTIg8y",
    "age": 22
}];

let access_token;

const saltRounds = 10;

const errorResponse = (schemaErrors) => {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        }
    });
    return {
        status: 'failed',
        errors
    }
}
const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        })
        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    }
}

const checkAccessPermission = (req, res, next) => {
    if (!access_token) {
        res.status(403).json({
            message: "Unauthorised operation"
        });
    } else {
        next();
    }
}

userRouter.post('/login', (req, res) => {
    const userExist = _.find(users, { login: req.body.login });
    if (userExist) {
        bcrypt.compare(req.body.password, userExist.password).then(result => {
            if (result) {
                access_token = userExist.password;
                res.status(200).json({
                    message: "Login Successfull",
                    access_token: userExist.password
                });
            } else {
                res.status(401).json({
                    message: "Invalid Login id and password entered"
                });
            }
        });
    } else {
        res.status(401).json({
            message: "Invalid Login id and password entered"
        });
    }
    // createUser().then(users => {
    //     if(users) {
    //         console.log("created user:",users);
    //         res.send(users);
    //     } else {
    //         res.status(400).send('Error in insert new record');
    //     }
    // })
});

userRouter.get('/users', checkAccessPermission, (req, res) => {
    res.json(users);
});

userRouter.get('/users/:id', checkAccessPermission, (req, res) => {
    const user = _.find(users, { id: req.params.id });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        })
    }
});

userRouter.put('/users/:id', validateSchema(userSchema), checkAccessPermission, (req, res) => {
    const userExist = _.find(users, { id: req.params.id });
    if (userExist) {
        bcrypt.hash(req.body.password, saltRounds).then(hash => {
            users.forEach(user => {
                if (user.id === req.body.id) {
                    user.id = req.body.id;
                    user.login = req.body.login;
                    user.password = hash;
                    user.age = req.body.age;
                    user.isDeleted = false;
                }
                return user;
            });
            res.status(200).json({
                message: `User with id ${req.params.id} updated successfully`
            })
        });

    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        })
    }
});

userRouter.post('/addUser', validateSchema(userSchema), checkAccessPermission, (req, res) => {
    const userExist = _.find(users, { id: req.body.id });
    if (!userExist) {
        bcrypt.hash(req.body.password, saltRounds).then(hash => {
            const user = {
                id: req.body.id,
                login: req.body.login,
                password: hash,
                age: req.body.age,
                isDeleted: false
            };
            users.push(user);
            res.status(200).json({
                message: `User with id ${req.body.id} created successfully`
            });
        });
    } else {
        res.status(409).json({
            message: `User with id ${req.body.id} already exist`
        });
    }
});

userRouter.delete('/users/:id', checkAccessPermission, (req, res) => {
    let userExist = _.find(users, { id: req.params.id });
    if (userExist) {
        users.forEach(user => {
            if (user.id === req.params.id) {
                user.isDeleted = true;
            }
            return user;
        });
        res.status(200).json({
            message: "User deleted successfully"
        })
    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        })
    }
});

userRouter.get('/autoSuggest', checkAccessPermission, async (req, res) => {
    const searchString = req.query.search;
    const limit = req.query.limit;
    const result = await getAutoSuggestUsers(searchString, limit);
    if (result.length) {
        res.status(200).json(result);
    } else {
        res.status(404).json({
            message: `No results found`
        })
    }
});

function getAutoSuggestUsers(loginSubstring, limit) {
    return users.filter(user => user.login.startsWith(loginSubstring)).sort((user1, user2) => user1.login > user2.login).slice(0, limit);
}

module.exports = userRouter;