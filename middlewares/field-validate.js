const {validationResult} = require('express-validator');

/**
 * Toma todos los errores entrantes y los mete a un array de objectos tipo error.
 * Luego se despliegan todos los errores en formato JSON detallando cuales fueron los errores
 */
const fieldValidator = (req, res, next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
}

module.exports = {
    fieldValidator
}
