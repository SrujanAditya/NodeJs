const Joi = require('joi');

const userSchema = Joi.object().keys({
    id: Joi.string().required(),
    login: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(130).required()
});

module.exports = userSchema;