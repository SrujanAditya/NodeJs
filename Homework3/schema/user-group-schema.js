const Joi = require('joi');

const userGroupSchema = Joi.object().keys({
    groupId: Joi.string().required(),
    userIds: Joi.array().required()
});

module.exports = userGroupSchema;