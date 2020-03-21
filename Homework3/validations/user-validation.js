const jwt = require('jsonwebtoken');

const errorResponse = (schemaErrors) => {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        }
    });
    return {
        status: 'failed',
        errors
    }
}
const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        })
        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    }
}

const checkAccessPermission = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: err
                })
            } else {
                next();
            }
        })

    } else {
        res.status(403).send({
            message: 'Forbidden Error'
        });
    }
}

module.exports = { validateSchema, checkAccessPermission };
