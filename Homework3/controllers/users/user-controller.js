const express = require('express');
const userSchema = require('../../schema/user-schema');
const userGroupSchema = require('../../schema/user-group-schema');
const { validateSchema, checkAccessPermission } = require('../../validations/user-validation');
const userService = require('../../services/users/user-service');
const { userModal } = require('../../modals/users/user-modal');
const op = require('sequelize').Op;
const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await userService.getUserLoginDetails(login, password);
        if (result) {
            access_token = result;
            req.session.authId = result;
            res.status(200).json({
                message: "Login Successfull",
                access_token: result
            });
        } else {
            res.status(401).json({
                message: "Invalid Login id and password entered"
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.get('/users', checkAccessPermission, async (req, res) => {
    try {
        const users = await userModal.findAll()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.get('/users/:id', checkAccessPermission, async (req, res) => {
    try {
        const user = await userModal.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({
                message: `User with id ${req.params.id} not found`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.put('/users/:id', validateSchema(userSchema), checkAccessPermission, async (req, res) => {
    const param_id = req.params.id;
    const { id, login, password, age } = req.body;
    try {
        const result = await userService.updateUserData(param_id, id, login, password, age);
        if (result[0]) {
            res.status(200).json({
                message: `User with id ${param_id} updated successfully`
            });
        } else {
            res.status(404).json({
                message: `User with id ${param_id} not found`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

userRouter.post('/addUser', validateSchema(userSchema), checkAccessPermission, async (req, res) => {
    const { id, login, password, age } = req.body;
    try {
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
    } catch (err) {
        res.status(500).json(err);
    }

});

userRouter.delete('/users/:id', checkAccessPermission, async (req, res) => {
    try {
        const result = await userModal.update(
            { isDeleted: true },
            { returning: true, where: req.params.id }
        );
        if (result) {
            res.status(200).json({
                message: "User deleted successfully"
            });
        } else {
            res.status(404).json({
                message: `User with id ${req.params.id} not found`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.get('/autoSuggest', checkAccessPermission, async (req, res) => {
    try {
        const result = await serModal.findAll({
            where: {
                login: { [op.like]: `${req.query.search}%` }
            },
            order: [
                ['login', 'ASC']
            ],
            limit: req.query.limit
        });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.post('/addUserToGroup', validateSchema(userGroupSchema), checkAccessPermission, async (req, res) => {
    const { groupId, userIds } = req.body;
    try {
        const result = await userService.addUsersToGroup(groupId, userIds);
        if (result) {
            res.status(200).json({
                message: `Users added to group Id ${groupId} successfully`
            });
        } else {
            res.status(409).json({
                message: `Users not added to group Id ${groupId}, due to voilation of constraints`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = userRouter;