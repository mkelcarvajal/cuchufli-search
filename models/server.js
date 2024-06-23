const express = require('express');
const cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/users';
        this.authPath = '/api/auth'
        this.csvRoutePath = '/api/csv';

        //Database connection
        // this.databaseConnection();

        // Middlewares
        this.middlewares();

        // carga las rutas que corresponden.
        this.routes();

    }

    async databaseConnection() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Read and parse body
        this.app.use(express.json());
        // directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        // en la carpeta routes/users el 'router' toma el valor de '/api/users', el require indica a donde va a parar ese prefijo
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usersRoutePath, require('../routes/user'));
        this.app.use(this.csvRoutePath, require('../routes/csv'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`SERVER http://localhost:${this.port}/`)
        });
    }

}

module.exports = Server;
