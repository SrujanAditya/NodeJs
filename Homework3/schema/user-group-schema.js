const Joi = require('joi');

const userGroupSchema = Joi.object().keys({
    userId: Joi.string().required(),
    groupId: Joi.array().required()
});

module.exports = userGroupSchema;