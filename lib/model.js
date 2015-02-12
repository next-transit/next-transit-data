module.exports = function(conn_string) {
  var likan = require('likan')(conn_string);

  return {
    create: function(table, options) {
      var model = likan.create(table, options),
          base_select = model.select;

      // Overrides likan select queries to easily attach an agency_id where clause to everything, 
      // since it's used on almost every table
      model.select = function(agency_id) {
        var columns = typeof agency_id === 'number' ? null : agency_id,
            select = base_select.call(model, columns);

        if(typeof agency_id === 'number') {
          select.where('agency_id = ?', [agency_id]);
        }

        return select;
      };

      return model;
    }
  };
};
