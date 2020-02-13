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
    if (!req.session.authId) {
        res.status(403).json({
            message: "Unauthorised operation"
        });
    } else {
        next();
    }
}

module.exports = { validateSchema, checkAccessPermission };
