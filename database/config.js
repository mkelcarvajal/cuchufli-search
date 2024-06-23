require('dotenv').config();
const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGO_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online');

    } catch (e) {
        console.log(e);
        throw new Error('Error al momento de conectarse a la base de datos');
    }

}

module.exports = {
    dbConnection
}
