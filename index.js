require('dotenv').config();
var express = require('express');
var path = require('path');

var app = express();


var testData = [
    {
        "propertyId": 1,
        "name": "Casa do Zé",
        "cityState": "Santa Mariana - PR",
        "type": "Casa",
        "price": 500.99,
        "totalArea": 32,
        "usefulArea": 20,
        "rooms": 1,
        "thumbUrl": "http://portal8.casasoft.net.br/indicadordeimoveis/imobiliarias/13650/fotos/medio480x360/259713650/2846913650.jpg"
    },
    {
        "propertyId": 2,
        "name": "Villa Ferrari",
        "cityState": "Montes Claros - MG",
        "type": "Apartamento",
        "price": 9700.50,
        "totalArea": 50,
        "usefulArea": 43,
        "rooms": 4,
        "thumbUrl": "https://www.heartmilanapartments.com/wp-content/uploads/Heart-Milan-Apartments-home.jpg"
    },
    {
        "propertyId": 3,
        "name": "Apê do Arata",
        "cityState": "Marília - SP",
        "type": "Apartamento",
        "price": 4356.67,
        "totalArea": 35,
        "usefulArea": 30,
        "rooms": 2,
        "thumbUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPGmGaw6hYo3GyZWXki2267gRCThKgDlIgSWIexh7NNv39AG2F"
    },
    {
        "propertyId": 4,
        "name": "Cantinho da vovó",
        "cityState": "Cornélio Procópio - PR",
        "type": "Pensionato",
        "price": 700.00,
        "totalArea": 32,
        "usefulArea": 27,
        "rooms": 10,
        "thumbUrl": "http://2.bp.blogspot.com/-dk06RydWhhI/UbUIaGouuhI/AAAAAAAAADE/NeDVi02aTXI/s1600/CAPA%2BBLOG%2Bcopy%2B%255B%255D.jpg"
    }
];

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

app.use('/api', require('./api/api'));

app.use(function (req, res, next) {
    res.status(404).type('html').send('<h1>Erro 404. Esta página não existe!</h1>');
});

app.listen(3000, function() {
	console.log('Web application server started!');
});
