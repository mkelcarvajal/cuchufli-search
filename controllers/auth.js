const {request, response} = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const {generateJWT} = require("../helpers/utils");

const login = async (req = request, res = response) =>{

    try {

        const { email, password } = req.body;

        // Verify if email exist
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                msg: "Email incorrect or user not exist"
            })
        }

        // Verify if user is active
        if (!user.state) {
            return res.status(400).json({
                msg: "User inactive"
            })
        }

        // Verify password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password incorrect"
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);
        res.json({
            user,
            token
        })

    } catch (e) {
        return res.status(500).json({
            msg: 'Error',
            e
        })
    }
}

module.exports = {
    login
}
