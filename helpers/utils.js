const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const encryptPassword = (password) => {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
}

const generateJWT = async (uid = '') => {
    return new Promise((resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
           expiresIn: '4h'
        }, (error, token) => {
            if (error) {
                reject('Token can not was possible generate');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = {
    encryptPassword,
    generateJWT
}
