const {Schema, model} = require('mongoose');

const UserSchema = Schema({

    name: {
        type: String,
        required: [
            true,
            'The name is required'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'The email is required'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [
            true,
            'The password is required'
        ]
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: [
            'ADMIN_ROLE',
            'USER_ROLE',
            'SALE_ROLE'
        ]
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Metodo que sobreescribre el toJSON de respuesta cuando se crea un nuevo usuario para no devolver password ni __v
UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);
