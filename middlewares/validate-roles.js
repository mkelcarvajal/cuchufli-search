const {response, request} = require('express');

const isAdminRole = (req = request, res = response, next) => {

    if (!req.userPetition) {
        res.status(500).json({
            msg: 'User petition not include in the token'
        });
    }

    const {role, name} = req.userPetition;
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not Admin`
        });
    }
    next();
}

const haveRole = ( ...roles ) => {
    return (req = request, res = response, next) => {

        if (!req.userPetition) {
            res.status(500).json({
                msg: 'User petition not include in the token'
            });
        }

        const userPetition = req.userPetition;
        if (!roles.includes(userPetition.role)) {
            res.status(401).json({
                msg: `${userPetition.name} no authorized for this petition`
            });
        }
        next();
    }
}


module.exports = {
    isAdminRole,
    haveRole
}
