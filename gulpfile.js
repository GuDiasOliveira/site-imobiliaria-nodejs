require('dotenv').config();
var gulp = require('gulp');
var fs = require('fs');


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