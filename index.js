require('dotenv').config();
var express = require('express');
var path = require('path');

var app = express();


// var testData = [
//     {
//         "property_id": 1,
//         "name": "Casa do Zé",
//         "city_state": "Santa Mariana - PR",
//         "type": "Casa",
//         "price": 500.99,
//         "total_area": 32,
//         "useful_area": 20,
//         "rooms": 1,
//         "thumb_url": "http://portal8.casasoft.net.br/indicadordeimoveis/imobiliarias/13650/fotos/medio480x360/259713650/2846913650.jpg"
//     },
//     {
//         "property_id": 2,
//         "name": "Villa Ferrari",
//         "city_state": "Montes Claros - MG",
//         "type": "Apartamento",
//         "price": 9700.50,
//         "total_area": 50,
//         "useful_area": 43,
//         "rooms": 4,
//         "thumb_url": "https://www.heartmilanapartments.com/wp-content/uploads/Heart-Milan-Apartments-home.jpg"
//     },
//     {
//         "property_id": 3,
//         "name": "Apê do Arata",
//         "city_state": "Marília - SP",
//         "type": "Apartamento",
//         "price": 4356.67,
//         "total_area": 35,
//         "useful_area": 30,
//         "rooms": 2,
//         "thumb_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPGmGaw6hYo3GyZWXki2267gRCThKgDlIgSWIexh7NNv39AG2F"
//     },
//     {
//         "property_id": 4,
//         "name": "Cantinho da vovó",
//         "city_state": "Cornélio Procópio - PR",
//         "type": "Pensionato",
//         "price": 700.00,
//         "total_area": 32,
//         "useful_area": 27,
//         "rooms": 10,
//         "thumb_url": "http://2.bp.blogspot.com/-dk06RydWhhI/UbUIaGouuhI/AAAAAAAAADE/NeDVi02aTXI/s1600/CAPA%2BBLOG%2Bcopy%2B%255B%255D.jpg"
//     }
// ];

// app.get('/teste', function(req, res) {
//     res.header('Content-Type', 'text/json');
//     res.json(testData);
// });

app.get('/teste-upload-property-photos', function (req, res) {
    res.sendFile(path.resolve('test/test-upload-property-photos.html'));
});

app.use('/css', express.static('views/css'));
app.use('/js', express.static('views/js'));
app.use('/images', express.static('views/images'));
app.use('/media', express.static('media'));

app.get('/', function (req, res) {
    res.sendFile(path.resolve('views/main.html'));
});

app.use('/api', require('./api/api'));

// For testing 500 Internal Server errors
// app.get('/erro500', function (req, res) {
//     // Let's force an 500 error
//     var teste = ['teste'];
//     res.send(teste[1].foo());
// });

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
