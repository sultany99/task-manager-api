const { ZodError } = require('zod');

function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Make sure error.errors exists
                const messages = error.errors?.map(e => e.message) || ['Invalid input'];
                error.status = 400;
                error.message = messages.join(', ');
            }
            next(error);
        }
    };
}

module.exports = validate;
