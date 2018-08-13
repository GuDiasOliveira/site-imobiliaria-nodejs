var utils = require.main.require('./utils');
var path = require('path');
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var fileUpload = require('express-fileupload');
router.use(fileUpload());

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
        res.status(400).json(utils.apiResponseData(undefined, 'The propertyId must be a positive integer.')).end();
        return;
    }

    var property = new Property(function (conErr) {
        if (conErr) {
            res.status(500).json(utils.apiResponseData(undefined, 'Failed to connect to server database.'));
            res.end();
            property.end();
            return;
        }

        var propertyId = +req.params.propertyId;
        property.get(propertyId, function(result) {
            if (result != null) {
                res.status(200).json(utils.apiResponseData(adaptData(result)));
            } else {
                res.status(500).json(utils.apiResponseData(undefined, 'Failed retrieve the property.'));
            }
            res.end();
            property.end();
        });
    });
});


router.get('/', function(req, res) {
    var property = new Property(function (conErr) {
        if (conErr) {
            res.status(500).json(utils.apiResponseData(undefined, 'Failed to connect to server database.'));
            res.end();
            property.end();
            return;
        }

        property.getAll(function (result) {
            if (result == null) {
                res.status(500).json(utils.apiResponseData(undefined, 'Could not retrieve data from database.'));
            } else {
                for (var i in result)
                    adaptData(result[i]);
                res.status(200).json(utils.apiResponseData(result));
            }
            res.end();
            property.end();
        });
    });
});


router.post('/', function (req, res) {
    var property = new Property(function (conErr) {
        if (conErr) {
            res.status(500).json(utils.apiResponseData(undefined, 'Failed to connect to server database.'));
            res.end();
            property.end();
            return;
        }

        var thumbImg = req.files.thumb_img;
        var fimgExtension = null;
        if (thumbImg.mimetype == 'image/png') {
            fimgExtension = '.png';
        } else if (thumbImg.mimetype == 'image/jpeg') {
            fimgExtension = '.jpg';
        } else {
            res.status(400).json(utils.apiResponseData(undefined, 'Invalid image format of image thumb. Please upload a PNG or JPEG format.'));
            res.end();
            property.end();
            return;
        }
        if (!req.body.image_thumb_file.toLowerCase().endsWith(fimgExtension)) {
            req.body.image_thumb_file += fimgExtension;
        }

        property.insert(req.body, function(err) {
            if (err) {
                res.status(500).json(utils.apiResponseData(undefined, 'Could not insert data into database.'));
            } else {
                thumbImg.mv(path.join(process.cwd(), '/media/imoveis-thumb/', req.body.image_thumb_file), function (fmvErr) {
                    if (fmvErr) {
                        console.error(fmvErr);
                        res.status(207).json(utils.apiResponseData(undefined, 'Could not upload thumb file', true));
                    } else {
                        res.status(200).json(utils.apiResponseData());
                    }
                    res.end();
                });
            }
            property.end();
        });
    });
});


module.exports = function (app) {
    return router;
};