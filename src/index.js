const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

async function App() {
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    app.use((req, res, next) => {
        const error = new Error('Not found');
        error.status = 404;
        next(error);
    });
    app.use((error, req, res, nex) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message,
            }
        });
    });

    app.listen(port, () => {
        console.log('Listening at port: ' + port);
    })
}
App();