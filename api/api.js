var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var path = require('path');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

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
//     var teste = ['teste'];
//     res.send(teste[1].foo());
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