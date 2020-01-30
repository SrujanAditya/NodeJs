const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const userSchema = require('../schema/user-schema');
const validateSchema = require('../validations/user-validation');
const { getUsers, createUser, getUserById } = require('../data-access/user-data-access');
const userRouter = express.Router();

let users = [{
    "id": "000",
    "login": "admin@gmail.com",
    "password": "$2b$10$wQ9iytzxUb/2QnVmOBJ3WuN9bsVgvkqG7nnoqtP5peSpJE1eTIg8y",
    "age": 22
}];

let access_token;

const saltRounds = 10;

const checkAccessPermission = (req, res, next) => {
    if (access_token) {
        res.status(403).json({
            message: "Unauthorised operation"
        });
    } else {
        next();
    }
}

userRouter.post('/login', (req, res) => {
    // const userExist = _.find(users, { login: req.body.login });
    // if (userExist) {
    //     bcrypt.compare(req.body.password, userExist.password).then(result => {
    //         if (result) {
    //             access_token = userExist.password;
    //             res.status(200).json({
    //                 message: "Login Successfull",
    //                 access_token: userExist.password
    //             });
    //         } else {
    //             res.status(401).json({
    //                 message: "Invalid Login id and password entered"
    //             });
    //         }
    //     });
    // } else {
    //     res.status(401).json({
    //         message: "Invalid Login id and password entered"
    //     });
    // }
    getUserById('003').then(user => console.log(user.dataValues)).catch(err => console.log(err))

});

userRouter.get('/users', checkAccessPermission, (req, res) => {
    getUsers().then((users) => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({
            message: "Something broken"
        });
    })
});

userRouter.get('/users/:id', checkAccessPermission, (req, res) => {
    getUserById(req.params.id).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: `User with id ${req.params.id} not found`
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err,
            message: "something borken"
        });
    });
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
    getUserById(req.body.id).then(userExist => {
        if (!userExist) {
            bcrypt.hash(req.body.password, saltRounds).then(hash => {
                const user = {
                    id: req.body.id,
                    login: req.body.login,
                    password: hash,
                    age: req.body.age,
                    isDeleted: false
                };
                createUser(user).then(() => {
                    res.status(200).json({
                        message: `User with id ${req.body.id} created successfully`
                    });
                }).catch(err => {
                    res.status(500).json({
                        error: err,
                        message: "something borken"
                    });
                });
            });
        } else {
            res.status(409).json({
                message: `User with id ${req.body.id} already exist`
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err,
            message: "something borken"
        });
    });
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