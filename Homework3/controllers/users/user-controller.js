const express = require('express');
const userSchema = require('../../schema/user-schema');
const validateSchema = require('../../validations/user-validation');
const userService = require('../../services/users/user-service');
const userRouter = express.Router();

let access_token;

const checkAccessPermission = (req, res, next) => {
    if (!access_token) {
        res.status(403).json({
            message: "Unauthorised operation"
        });
    } else {
        next();
    }
}

userRouter.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const result = await userService.getUserLoginDetails(login, password);
    if (result) {
        access_token = result;
        res.status(200).json({
            message: "Login Successfull",
            access_token: result
        });
    } else {
        res.status(401).json({
            message: "Invalid Login id and password entered"
        });
    }
});

userRouter.get('/users', checkAccessPermission, async (req, res) => {
    const { result, err } = await userService.getUsersData();
    if (result) res.status(200).json(result);
    if (err) res.status(500).json(err);
});

userRouter.get('/users/:id', checkAccessPermission, async (req, res) => {
    const id = req.params.id;
    const { user, err } = await userService.getUserDataByID(id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        });
    }
    if (err) res.status(500).json(err);
});

userRouter.put('/users/:id', validateSchema(userSchema), checkAccessPermission, async (req, res) => {
    const param_id = req.params.id;
    const { id, login, password, age } = req.body;
    const result = await userService.updateUserData(param_id, id, login, password, age);
    if (result) {
        res.status(200).json({
            message: `User with id ${param_id} updated successfully`
        });
    } else {
        res.status(404).json({
            message: `User with id ${param_id} not found`
        })
    }
});

userRouter.post('/addUser', validateSchema(userSchema), checkAccessPermission, async (req, res) => {
    const { id, login, password, age } = req.body;
    const result = await userService.addUser(id, login, password, age);
    if (result) {
        res.status(200).json({
            message: `User with id ${id} created successfully`
        });
    } else {
        res.status(422).json({
            message: `User with id ${id} already exist`
        });
    }
});

userRouter.delete('/users/:id', checkAccessPermission, async (req, res) => {
    const { id } = req.params;
    const result = await userService.deleteUserData(id);
    if (result) {
        res.status(200).json({
            message: "User deleted successfully"
        });
    } else {
        res.status(404).json({
            message: `User with id ${id} not found`
        });
    }
});

userRouter.get('/autoSuggest', checkAccessPermission, async (req, res) => {
    const { search, limit } = req.query;
    const { result, err } = await userService.getUsersByLogin(search, limit);
    if (result) res.status(200).json(result);
    if (err) res.status(500).json(err);
});

module.exports = userRouter;