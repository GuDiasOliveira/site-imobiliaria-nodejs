

var apiResponseData = function(data, error) {
    if (error == undefined)
        error = null;
    return { 'error': error, 'data': data };
};


module.exports = function (app) {
    return apiResponseData;
};