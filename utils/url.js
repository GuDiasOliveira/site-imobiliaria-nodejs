

var url = function(path) {
    var basePath = process.env.BASE_URL;
    basePath = basePath.replace(/\/$/, '');
    var separator = path.startsWith('/') ? '' : '/';
    return basePath + separator + path;
};


module.exports = function (app) {
    return url;
};