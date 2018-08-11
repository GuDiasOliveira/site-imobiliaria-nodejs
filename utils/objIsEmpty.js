var objIsEmpty = function (obj) {
    for (var key in obj)
        return false;
    return true;
};


module.exports = function(app) {
    return objIsEmpty;
};