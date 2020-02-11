const express = require('express');
const groupSchema = require('../../schema/group-schema');
const validateSchema = require('../../validations/user-validation');
const groupService = require('../../services/groups/group-service');
const groupRouter = express.Router();

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

groupRouter.get('/groups', checkAccessPermission, async (req, res) => {
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
            message: `Group with id ${req.params.id} not found`
        });
    }
    if (err) res.status(500).json(err);
});

groupRouter.put('/groups/:id', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    const param_id = req.params.id;
    const { id, name, permissions } = req.body;
    const { result, data, err } = await groupService.updateGroupData(param_id, id, name, permissions);
    if (result) {
        if (data[0] !== 0) {
            res.status(200).json({
                message: `Group with id ${param_id} updated successfully`
            });
        } else {
            res.status(404).json({
                message: `Group with id ${param_id} doesnot exist`
            });
        }
    } else {
        res.status(404).json(err.errors);
    }
});

groupRouter.post('/addGroup', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    const { id, name, permissions } = req.body;
    const result = await groupService.addGroup(id, name, permissions);
    if (result) {
        res.status(200).json({
            message: `Group with id ${id} created successfully`
        });
    } else {
        res.status(422).json({
            message: `Group with id ${id} already exist`
        });
    }
});

groupRouter.delete('/groups/:id', checkAccessPermission, async (req, res) => {
    const { id } = req.params;
    const result = await groupService.deleteGroupData(id);
    if (result) {
        res.status(200).json({
            message: `Group with id ${id} deleted successfully`
        });
    } else {
        res.status(404).json({
            message: `Group with id ${id} not found`
        });
    }
});

module.exports = groupRouter;