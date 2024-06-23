const {request, response} = require('express');
const User = require('../models/user');
const {encryptPassword} = require('../helpers/utils');


const getAllUser = async (req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {state: true};

    const [totalUsers, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(parseInt(from))
            .limit(parseInt(limit))
    ]);

    res.json({
        totalUsers,
        users
    });
}

const getUserById = async (req = request, res = response) => {

    const id = req.params.id;

    const user = await User.findById(id);

    res.json({
        user
    });
}

const updateUser = async (req = request, res = response) => {
    const {id} = req.params.id;
    const {_id, password, google, email, ...user} = req.body

    if (password) {
        encryptPassword(password);
    }

    const updateUser = await User.findById(id);
    console.log(updateUser);
    res.json({
        msg: 'put API - Controller',
        updateUser
    });
}

const createUser = async (req = request, res = response) => {
    try {

        const {name, email, password, role} = req.body;
        const user = new User({name, email, password, role});

        // Encrypt password (method in helpers/utils.js);
        user.password = encryptPassword(password);

        // Save in DB
        await user.save();
        res.json({
            msg: 'post API - Controller',
            user
        });
    } catch (e) {
        console.log(e);
    }
}

const deleteUser = async (req = request, res = response) => {

    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, {state: false});
        const userPetition = req.userPetition;
        user.save();
        res.json({
            user,
            userPetition
        });
    } catch (e) {
        console.log(e);
    }
}

const patchUser = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}


module.exports = {
    getAllUser,
    getUserById,
    updateUser,
    createUser,
    deleteUser,
    patchUser
}
