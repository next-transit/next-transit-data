var likan = { create:function() {} };

function init(conn_string) {
  likan = require('likan')(conn_string);
};

init.create = function(table, options) {
  var model = likan.create(table, options),
      base_select = model.select,
      base_delete_import = model.delete_import;

  // Overrides likan select queries to easily attach an agency_id where clause to everything, 
  // since it's used on almost every table
  model.select = function(agency_id, options) {
    var columns = typeof agency_id === 'number' ? null : agency_id,
        select = base_select.call(model, columns, options);

    if(typeof agency_id === 'number') {
      select.where('agency_id = ?', agency_id);
    }

    return select;
  };

  model.delete_import = function(agency_id, file_path, columns) {
    return base_delete_import.call(model, file_path, columns).where('agency_id = ?', [agency_id]);
  };

  return model;
};

module.exports = init;
