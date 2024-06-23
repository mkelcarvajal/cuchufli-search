const {Router} = require('express');
const {check} = require('express-validator');
const {fieldValidator} = require("../middlewares/field-validate");
const {getAllUser, getUserById,updateUser, createUser, deleteUser, patchUser} = require("../controllers/user");
const {roleExist, emailExist, userExist} = require("../helpers/db-validator");
const {validateJWT} = require("../middlewares/validate-jwt");
const {isAdminRole, haveRole} = require("../middlewares/validate-roles");

const router = new Router();

router.get('/', [
    validateJWT,
    fieldValidator
], getAllUser);


router.get('/:id', [
    validateJWT,
    check('id', 'Is not valid ID').isMongoId(),
    check('id').custom(id => userExist(id)),
    fieldValidator
], getUserById);


router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not valid ID').isMongoId(),
    check('id').custom(id => userExist(id)),
    check('email').custom(email => emailExist(email)),
    check('role').custom(role => roleExist(role)),
    fieldValidator
], updateUser);

router.post('/', [
    validateJWT,
    isAdminRole,
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'This email is not valid').isEmail(),
    check('password', 'The password must be higher to 6 character').isLength({min: 6}),
    // check('role', 'This value is not role allowed').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(role => roleExist(role)),
    check('email').custom(email => emailExist(email)),
    fieldValidator
], createUser);

router.delete('/:id', [
    validateJWT,
    //isAdminRole,
    haveRole("ADMIN_ROLE", "SALE_ROLE"),
    check('id', 'Is not valid ID').isMongoId(),
    check('id').custom(id => userExist(id)),
    fieldValidator
], deleteUser);

router.patch('/', patchUser);

module.exports = router;
