var utils = require.main.require('./utils');
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Property = require('../models/property');


function adaptData(property) {
    if (utils.objIsEmpty(property)) {
        return property;
    }
    property.thumb_url = utils.url('/media/imoveis-thumb/' + property.image_thumb_file);
    property.image_thumb_file = undefined;
    return property;
}


router.get('/:propertyId', function(req, res) {
    if (!req.params.propertyId.match(/^([1-9][0-9]*|0)$/)) {
        res.status(400).json({ 'error': 'The propertyId must be a positive integer.' }).end();
        return;
    }

    var property = new Property(function (conErr) {
        if (conErr) {
            res.status(500).json({'error': 'Failed to connect to server database.'});
            res.end();
            property.end();
            return;
        }

        var propertyId = +req.params.propertyId;
        property.get(propertyId, function(result) {
            if (result != null) {
                res.status(200).json(adaptData(result));
            } else {
                res.status(500).json({'error': 'Failed retrieve the property.'});
            }
            res.end();
            property.end();
        });
    });
});


module.exports = [router];