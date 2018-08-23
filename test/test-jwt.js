var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


// Login
router.post('/login', function (req, res) {
    // Mock user
    var user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    };

    jwt.sign({ user: user }, 'secretkey', { expiresIn: '30s' }, function (err, token) {
        res.json({
            token: token
        });
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
                    res.status(403).json({error: "Token expired!"});
                } else {
                    // Auth fail
                    res.sendStatus(403);
                    console.error(err);
                }
            } else {
                // Authenticated
                res.locals.authData = authData;
                next();
            }
        });
    } else {
        // Forbidden without token
        res.sendStatus(403);
    }
}

// For non GET requests, it must auth with token
router.use('/', function(req, res, next) {
    if (req.method != 'GET') {
        verifyToken(req, res, next);
    } else {
        next();
    }
});


router.post('/posts', function (req, res) {  
    res.json({
        message: 'Post created...',
        authData: res.locals.authData
    });
});


module.exports = router;