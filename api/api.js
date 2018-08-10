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
    router.use('/' + controller, controllers.controllers[controller][0]);
}

router.use(function (req, res, next) {
    res.status(404).json({'error': 'This path does not exist.'});
});


module.exports = router;