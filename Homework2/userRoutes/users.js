const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const userRouter = express.Router();

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, removeAdditional: 'all' });
const userSchema = require('../schema.json');
ajv.addSchema(userSchema, 'new-user');

let users = [
    {
        id: '001',
        login: 'xyz4@abxy.com',
        password: '@@#gvk_!s&p',
        age: 22,
        isDeleted: false
    },
    {
        id: '002',
        login: 'xyz3@abxy.com',
        password: '@@#gvk_!s&p',
        age: 22,
        isDeleted: false
    },
    {
        id: '003',
        login: 'xyz2@abxy.com',
        password: '@@#gvk_!s&p',
        age: 22,
        isDeleted: false
    }, {
        id: '004',
        login: 'xyz1@abxy.com',
        password: '@@#gvk_!s&p',
        age: 22,
        isDeleted: false
    }
];

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
        errors: errors
    }
}
const validateSchema = (schemaName) => {
    return (req, res, next) => {
        let isValid = ajv.validate(schemaName, req.body);
        if (!isValid) {
            res.status(400).json(errorResponse(ajv.errors));
        } else {
            next();
        }
    }
}

userRouter.get('/users', (req, res) => {
    res.json(users);
});

userRouter.get('/users/:id', (req, res) => {
    const user = _.find(users, { id: req.params.id });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        })
    }
});

userRouter.put('/users/:id', validateSchema(userSchema), (req, res) => {
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

userRouter.post('/addUser', validateSchema(userSchema), (req, res) => {
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
        })
    }
});

userRouter.delete('/users/:id', (req, res) => {
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

userRouter.get('/autoSuggest', async (req, res) => {
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