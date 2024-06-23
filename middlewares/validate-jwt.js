const jwt = require('jsonwebtoken');
const {request, response} = require('express');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token no exist in the request'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPUBLICKEY);
        const userPetition = await User.findById(uid);

        if (!userPetition) {
            return res.status(401).json({
                msg: 'User not exist in DB'
            })
        }

        if (!userPetition.state) {
            return res.status(401).json({
                msg: 'User inactive'
            })
        }

        req.userPetition = userPetition;
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            msg: 'Token not valid',
            e
        })
    }
}

module.exports = {
    validateJWT
}
