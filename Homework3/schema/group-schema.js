const Joi = require('joi');

const groupSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    permissions: Joi.array().required()
});

module.exports = groupSchema;