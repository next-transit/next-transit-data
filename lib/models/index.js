module.exports = function(conn_string) {
  var model = require('./model')(conn_string);

  return {
    agencies:           require('./agencies'),
    api_keys:           require('./api_keys'),
    calendar_dates:     require('./calendar_dates'),
    directions:         require('./directions'),
    display_trips:      require('./display_trips'),
    recent_trips:       require('./recent_trips'),
    route_types:        require('./route_types'),
    routes:             require('./routes'),
    saved_trips:        require('./saved_trips'),
    shapes:             require('./shapes'),
    simplified_shapes:  require('./simplified_shapes'),
    simplified_stops:   require('./simplified_stops'),
    stats:              require('./stats'),
    stop_times:         require('./stop_times'),
    stops:              require('./stops'),
    trip_variants:      require('./trip_variants'),
    trips:              require('./trips')
  };
};
