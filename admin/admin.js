var express = require('express');
var path = require('path');
var utils = require.main.require('./utils');
var router = express.Router();


router.get('/', function (req, res) {
    res.status(200).sendFile(path.resolve('admin/panel.html'));
});


module.exports = router;