var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');


var dirToSave = function(p, callback) {
    if (!fs.existsSync(path.join(process.cwd(), p))) {
        mkdirp(path.join(process.cwd(), p), function(err) {
            if (err) {
                console.error(err);
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};


module.exports = function (app) {
    return dirToSave;
};