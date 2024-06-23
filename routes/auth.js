const {Router} = require('express');
const {check} = require('express-validator');
const {login} = require("../controllers/auth");
const {fieldValidator} = require("../middlewares/field-validate");

const router = new Router();


router.post('/login', [
    check('email', 'The email is required or format is not correct').isEmail(),
    check('password', 'The password can not be empty').not().isEmpty(),
    fieldValidator,
],login);

module.exports = router
