var consign = require('consign');


var utils = {};

consign()
    .include('utils')
    .into(utils);


module.exports = utils.utils;