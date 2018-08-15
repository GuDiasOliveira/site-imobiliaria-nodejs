var utils = require.main.require('./utils');
var path = require('path');
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var dateFormat = require('dateformat');
var sleep = require('sleep');
var multer  = require('multer');

var Property = require('../models/property');


Date.prototype.toPropertyPhotoTimestamp = function() {
    return dateFormat(new Date(), 'yyyy_mm_dd__HH_MM_ss_l');
};


router.post('/:propertyId', function (req, res) {
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
        property.exists(propertyId, function (exists) {
            property.end();
            if (exists != null) {
                if (exists) {
                    // The property exists, then post the photos
                    var storage = multer.diskStorage({
                        destination: function (req, file, callback) {
                            callback(null, path.join(process.cwd(), '/media/imoveis-fotos/', String(propertyId)));
                        },
                        filename: function (req, file, callback) {
                            var fimgExtension = null;
                            var filename = file.fieldname;
                            if (file.mimetype == 'image/png') {
                                fimgExtension = '.png';
                            } else if (file.mimetype == 'image/jpeg') {
                                fimgExtension = '.jpg';
                            } else {
                                res.status(400).json(utils.apiResponseData(undefined, 'Invalid image format of image. Please upload a PNG or JPEG format.'));
                                res.end();
                                return;
                            }
                            filename = new Date().toPropertyPhotoTimestamp() + fimgExtension;
                            sleep.msleep(1);
                            callback(null, filename);
                        }
                    });
                    var propertyPhotosUpload = multer({
                        storage: storage,
                        fileFilter: function (req, file, callback) {
                            callback(null, file.mimetype == 'image/png' || file.mimetype == 'image/jpeg');
                        }
                    });
                    utils.dirToSave(path.join('/media/imoveis-fotos/', String(propertyId)), function(dirErr) {
                        propertyPhotosUpload.array('photos')(req, res, function (filesUploadErr) {
                            if (filesUploadErr) {
                                // Failed to save the photos on disk
                                res.status(500).json(utils.apiResponseData(undefined, 'Failed to upload the property\'s photos'));
                                console.error(filesUploadErr);
                            } else {
                                // Photos upload successfully
                                res.status(200).json(utils.apiResponseData());
                            }
                        });
                    });
                } else {
                    // If there is no such property with the given if, no photo will be posted
                    res.status(400).json(utils.apiResponseData(undefined, 'No such property with id ' + propertyId));
                }
            } else {
                // In case of fail to get whether exists a property with given id
                res.status(500).json(utils.apiResponseData(undefined, 'Failed retrieve the property for which the photos would be posted.'));
            }
        });
    });
});


module.exports = function (app) {
    return router;
};