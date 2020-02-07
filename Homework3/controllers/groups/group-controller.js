const express = require('express');
// const groupSchema = require('../../schema/group-schema');
// const validateSchema = require('../../validations/user-validation');
const groupService = require('../../services/groups/group-service');
const groupRouter = express.Router();

let access_token;

const checkAccessPermission = (req, res, next) => {
    if (access_token) {
        res.status(403).json({
            message: "Unauthorised operation"
        });
    } else {
        next();
    }
}

groupRouter.get('/groups',checkAccessPermission, async (req, res) => {
    const { result, err } = await groupService.getGroupsData();
    if (result) res.status(200).json(result);
    if (err) res.status(500).json(err);
}); 

groupRouter.get('/groups/:id', checkAccessPermission, async (req, res) => {
    const id = req.params.id;
    const { group, err } = await groupService.getGroupDataByID(id);
    if (group) {
        res.status(200).json(group);
    } else {
        res.status(404).json({
            message: `User with id ${req.params.id} not found`
        });
    }
    if (err) res.status(500).json(err);
});

// groupRouter.put('/groups/:id', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
//     const param_id = req.params.id;
//     const { id, login, password, age } = req.body;
//     const result = await userService.updateUserData(param_id, id, login, password, age);
//     if (result) {
//         res.status(200).json({
//             message: `User with id ${param_id} updated successfully`
//         });
//     } else {
//         res.status(404).json({
//             message: `User with id ${param_id} not found`
//         })
//     }
// });

// groupRouter.post('/groups/add', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
//     const { id, login, password, age } = req.body;
//     const result = await userService.addUser(id, login, password, age);
//     if (result) {
//         res.status(200).json({
//             message: `User with id ${id} created successfully`
//         });
//     } else {
//         res.status(500).json({
//             message: `User with id ${id} already exist`
//         });
//     }
// });

// groupRouter.delete('/groups/:id', checkAccessPermission, async (req, res) => {
//     const { id } = req.params;
//     const result = await userService.deleteUserData(id);
//     if (result) {
//         res.status(200).json({
//             message: "User deleted successfully"
//         });
//     } else {
//         res.status(404).json({
//             message: `User with id ${id} not found`
//         });
//     }
// });

module.exports = groupRouter;