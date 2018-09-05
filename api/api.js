var express = require('express');
var utils = require.main.require('./utils');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// Login
router.post('/login', function (req, res) {
    // Check user and password
    if (req.body.user != process.env.ADMIN_USER || req.body.password != process.env.ADMIN_PASS) {
        // Invalid username and password
        res.status(401).json(utils.apiResponseData(undefined, 'Invalid username and password.'));
        return;
    }

    var user = {
        username: req.body.user,
    };

    jwt.sign({ user: user }, 'secretkey', { expiresIn: '1d' }, function (err, token) {
        res.json(utils.apiResponseData({token: token}));
    });
});

// Verifying token
function verifyToken(req, res, next) {
    // Get auth token value
    var token = req.headers.authorization;
    // Check if the token was provided
    if (typeof token !== 'undefined') {
        // Set the token
        req.token = token;
        // Verifying
        jwt.verify(req.token, 'secretkey', function (err, authData) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    // Token expired
                    res.status(403).json(utils.apiResponseData(undefined, "Auth token expired!"));
                } else {
                    // Auth fail
                    res.status(403).json(utils.apiResponseData(undefined, "Authentication failed!"));
                }
            } else {
                // Authenticated
                res.locals.authData = authData;
                next();
            }
        });
    } else {
        // Forbidden without token
        res.status(403).json(utils.apiResponseData(undefined, "You must authenticate to perform this request!"));
    }
}

// For non GET requests, it must auth with token
router.use('/', function(req, res, next) {
    if (req.method.toUpperCase() != 'GET') {
        verifyToken(req, res, next);
    } else {
        next();
    }
});

// Check valid token
router.post('/verifyToken', function (req, res) {
    res.json(utils.apiResponseData('Ok!'));
});

var consign = require('consign');
var controllers = {};

consign({ cwd: __dirname })
    .include('controllers')
    .into(controllers);

for (var controller in controllers.controllers) {
    router.use('/' + controller, controllers.controllers[controller]);
}

// For testing 500 Internal Server errors
// router.get('/error500', function (req, res) {
//     // Let's force an 500 error
//     throw 'Erro de teste';
// });

// Handle 404 Not Found
router.use(function (req, res, next) {
    res.status(404).json({'error': 'This path does not exist.'});
});

// Handle Server errors
router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({'error': 'There was an internal error on the server.'});
});


module.exports = router;