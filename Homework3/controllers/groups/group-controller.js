const express = require('express');
const groupSchema = require('../../schema/group-schema');
const { validateSchema, checkAccessPermission } = require('../../validations/user-validation');
const { groupModal } = require('../../modals/groups/group-modal');
const groupRouter = express.Router();
const logger = require('./../../loggers/winston-logger');

groupRouter.get('/groups', checkAccessPermission, async (req, res) => {
    logger.info(`Method: get, Path: /groups`);
    try {
        logger.info(`Method to call : groupModal.findAll()`);
        const groups = await groupModal.findAll();
        res.status(200).json(groups);
    } catch (err) {
        logger.error(`get:/groups, Error: ${err}`);
        res.status(500).json(err);
    }
});

groupRouter.get('/groups/:id', checkAccessPermission, async (req, res) => {
    logger.info(`Method: get, Path: /groups, Params: id`);
    try {
        logger.info(`Method to call : groupModal.findByPk, Arguments: id`);
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
        logger.error(`get:/groups/:id, Error: ${err}`);
        res.status(500).json(err);
    }
});

groupRouter.put('/groups/:id', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    logger.info(`Method: put, Path: /groups, Params: id`);
    const { id, name, permissions } = req.body;
    try {
        logger.info(`Method to call : groupModal.update, Arguments: id, new id, name, permissions`);
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
        logger.error(`put:/groups/:id, Error: ${err}`);
        res.status(500).json(err);
    }
});

groupRouter.post('/addGroup', validateSchema(groupSchema), checkAccessPermission, async (req, res) => {
    logger.info(`Method: post, Path: /addGroup`);
    const { id, name, permissions } = req.body;
    try {
        const group = {
            id,
            name,
            permissions
        };
        logger.info(`Method to call : groupModal.create, Arguments: id, name, permissions`);
        await groupModal.create(group);
        res.status(200).json({
            message: `Group with id ${id} created successfully`
        });
    } catch (err) {
        logger.error(`post:/addGroup, Error: ${err}`);
        res.status(422).json({
            message: `Group with id ${id} already exist`
        });
    }
});

groupRouter.delete('/groups/:id', checkAccessPermission, async (req, res) => {
    logger.info(`Method: delete, Path: /groups, Params:id`);
    try {
        logger.info(`Method to call : groupModal.destroy, Arguments: id`);
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
        logger.error(`delete:/groups/:id, Error: ${err}`);
        res.status(500).json(err);
    }
});

module.exports = groupRouter;