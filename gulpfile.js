require('dotenv').config();
var gulp = require('gulp');
var fs = require('fs');
var utils = require('./utils');


gulp.task('env-vars-file', function () {
    var file = fs.createWriteStream('.env.example');
    var envvars = require('./env-vars');
    for (var key in envvars) {
        file.write(key + '=' + envvars[key] + '\n');
    }
    file.end();
});


gulp.task('test-db-connection', function () {
    var dbConn = require('./db/connection')();
    dbConn.connect(function(err) {
        if (err) throw err;
        console.log("Connection successful!");
    });
    dbConn.end();
});


gulp.task('test-base-url', function () {
    console.log('Base Url: ' + process.env.BASE_URL);
    console.log(utils.url('path/to/somewhere.html?q=foo&id=22'));
    console.log(utils.url('/my/path/'));
});