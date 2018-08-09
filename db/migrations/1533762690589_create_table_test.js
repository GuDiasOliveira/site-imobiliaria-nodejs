var SQLBuilder = require('json-sql-builder');
var sqlb = new SQLBuilder('mysql');

var up = sqlb.build({
    $create: {
        $table: 'property',
        $define: {
            // fields
            property_id: { $column: { $type: 'INT', $autoInc: true } },
            name: { $column: { $type: 'VARCHAR', $length: 300 } },
            ciry_state: { $column: { $type: 'VARCHAR', $length: 400 } },
            type: { $column: { $type: 'VARCHAR', $length: 50 } },
            price: { $column: { $type: 'DECIMAL(20,2)', $notNull: true } },
            total_area: { $column: { $type: 'INT' } },
            useful_area: { $column: { $type: 'INT' } },
            rooms: { $column: { $type: 'INT' } },
            image_thumb_file: { $column: { $type: 'VARCHAR', $length: 300 } },
            // constraints
            pk_property: { $constraint: { $primary: true, $columns: 'property_id' } }
        }
    }
});

module.exports = {
    "up": up.sql,
    "down": "DROP TABLE property"
};