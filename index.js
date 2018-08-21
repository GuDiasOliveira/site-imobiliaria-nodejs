require('dotenv').config();
var express = require('express');
var path = require('path');
var request = require('request');
var utils = require.main.require('./utils');

var app = express();

var expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.get('/teste-upload-property-photos', function (req, res) {
    res.sendFile(path.resolve('test/test-upload-property-photos.html'));
});

app.use('/css', express.static('views/css'));
app.use('/js', express.static('views/js'));
app.use('/images', express.static('views/images'));
app.use('/media', express.static('media'));

app.get('/', function (req, res) {
    //throw 'Erro de teste'; // For 500 error testing
    res.render('pages/home');
});

app.use('/api', require('./api/api'));

app.get('/property/:propertyId', function (req, res, next) {
    if (!req.params.propertyId.match(/^([1-9][0-9]*|0)$/)) {
        next();
        return;
    }
    request(utils.url('/api/property/exists/' + req.params.propertyId), function (error, response, body) {
        var result = JSON.parse(body);
        if (error) {
            next(err);
        } else if(result.error) {
            next(new Error(result.error));
        } else if (result.data) {
            res.render('pages/property', {
                cssLoads: [
                    '/css/galleria.classic.css',
                    '/css/style.property.css'
                ],
                jsLoads: [
                    '/js/galleria.js'
                ],
                propertyId: req.params.propertyId
            });
        } else {
            next();
        }
    });
});

app.get('/test/photo-gallery', function (req, res) {
    res.sendFile(path.resolve('test/photo-gallery-test.html'));
});

// Handle 404 Not Found
app.use(function (req, res, next) {
    res.status(404).sendFile(path.resolve('views/error-pages/404.html'));
});

// Handle Server errors
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).sendFile(path.resolve('views/error-pages/5xx.html'));
});

app.listen(3000, function() {
	console.log('Web application server started!');
});
