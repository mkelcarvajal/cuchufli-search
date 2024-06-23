const Role = require('../models/role');
const User = require('../models/user');

const roleExist = async (role = '') => {
    const roleExist = await Role.findOne({role});
    if (!roleExist) {
        throw new Error(`The role ${role} selected no exist in the DB`)
    }
}

const emailExist = async (email) => {
    const emailExist = await User.findOne({email});
    if (emailExist) {
        throw new Error(`The email ${email} already exist in the DB`)
    }
}

const userExist = async (id) => {
    const userExist = await User.findById(id);
    if (!userExist) {
        throw new Error(`User no exist`);
    }
}

module.exports = {
    roleExist,
    emailExist,
    userExist
}
