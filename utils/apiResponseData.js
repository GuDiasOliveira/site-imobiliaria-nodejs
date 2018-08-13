

var apiResponseData = function(data, error, success) {
    if (error == undefined)
        error = null;
    if (success == undefined)
        success = !error;
    return { 'error': error, 'data': data, 'success': success };
};


module.exports = function (app) {
    return apiResponseData;
};