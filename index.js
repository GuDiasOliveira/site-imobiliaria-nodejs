var express = require('express');
var path = require('path');

var app = express();

var testData = {
    "school": "Escola técnica do Norte do Paraná",
    "school_code": 12345999,
    "course": "Informática",
    "students": [
        {"name": "Gustavo Dias", "code": 1338374},
        {"name": "Paulo Lacerda", "code": 122432},
        {"name": "Laíza Beatriz", "code": 445509},
        {"name": "Maria Letícia", "code": 12312}
    ]
}

app.get('/teste', function(req, res) {
    res.header('Content-Type', 'text/json');
    res.json(testData);
});

app.use('/css', express.static('views/css'));
app.use('/js', express.static('views/js'));
app.use('/images', express.static('views/images'));

app.get('/', function (req, res) {
    res.sendFile(path.resolve('views/main.html'));
});

app.listen(3000, function() {
	console.log('Web application server started!');
});
