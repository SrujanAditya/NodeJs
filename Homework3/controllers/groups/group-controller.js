const express = require('express');
const groupSchema = require('../../schema/group-schema');
const { validateSchema, checkAccessPermission } = require('../../validations/user-validation');
const { groupModal } = require('../../modals/groups/group-modal');
const groupRouter = express.Router();

groupRouter.get('/groups', checkAccessPermission, async (req, res) => {
    try {
        const groups = await groupModal.findAll();
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json(err);
    }
});

groupRouter.get('/groups/:id', checkAccessPermission, async (req, res) => {
    try {
        const group = await groupModal.findByPk(req.params.id);
        if (group) {
            res.status(200).json(group);
        }
        else {
            res.status(404).json({
                message: `Group with id ${req.params.id} not found`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

groupRouter.put('/groups/:id', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    const { id, name, permissions } = req.body;
    try {
        const result = await groupModal.update(
            { id, name, permissions },
            { returning: true, where: { id: req.params.id } }
        );
        if (result[0] !== 0) {
            res.status(200).json({
                message: `Group with id ${req.params.id} updated successfully`
            });
        } else {
            res.status(404).json({
                message: `Group with id ${req.params.id} doesnot exist`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

groupRouter.post('/addGroup', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    const { id, name, permissions } = req.body;
    try {
        const group = {
            id,
            name,
            permissions
        };
        const result = await groupModal.create(group);
        if (result) {
            res.status(200).json({
                message: `Group with id ${id} created successfully`
            });
        } else {
            res.status(422).json({
                message: `Group with id ${id} already exist`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

groupRouter.delete('/groups/:id', checkAccessPermission, async (req, res) => {
    try {
        const result = await groupModal.destroy(
            { where: { id: req.params.id } }
        );
        if (result) {
            res.status(200).json({
                message: `Group with id ${req.params.id} deleted successfully`
            });
        } else {
            res.status(404).json({
                message: `Group with id ${req.params.id} not found`
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = groupRouter;