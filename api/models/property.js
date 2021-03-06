var getDbConn = require.main.require("./db/connection");


var Property = function(connectionCallback) {
    this.con = getDbConn();
    this.con.connect(function(err) {
        connectionCallback(err);
    });
};


Property.prototype.insert = function(property, callback) {
    property.property_id = undefined;
    var sql = "INSERT INTO property SET ?";
    this.con.query(sql, property, function(err, result) {
        callback(err);
    });
};


Property.prototype.update = function(property, callback) {
    var propertyId = property.property_id;
    delete property.property_id;
    var sql = "UPDATE property SET ? WHERE ?";
    this.con.query(sql, [property, {property_id: propertyId}], function(err, result) {
        callback(err);
    });
};


Property.prototype.delete = function(propertyId, callback) {
    var sql = "DELETE FROM property WHERE property_id = ?";
    this.con.query(sql, [propertyId], function() {
        callback(err);
    });
};


Property.prototype.getAll = function(callbackResult) {
    var sql = "SELECT * FROM property";
    this.con.query(sql, [], function(err, result) {
        if (err) {
            console.error(err);
            callbackResult(null);
        } else {
            callbackResult(result);
        }
    });
};


Property.prototype.get = function(propertyId, callbackResult) {
    var sql = "SELECT * FROM property WHERE property_id = ?";
    this.con.query(sql, [propertyId], function(err, result) {
        if (err) {
            console.error(err);
            callbackResult(null);
        } else {
            callbackResult(result.length > 0 ? result[0] : {});
        }
    });
};


Property.prototype.exists = function(propertyId, callbackResult) {
    var sql = "SELECT COUNT(*) as prop_count FROM property WHERE property_id = ?";
    this.con.query(sql, [propertyId], function(err, result) {
        if (err) {
            console.error(err);
            callbackResult(null);
        } else {
            callbackResult(result[0].prop_count > 0);
        }
    });
};


Property.prototype.end = function() {
    this.con.end();
};


module.exports = Property;