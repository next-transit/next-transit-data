module.exports = function(conn_string) {
  var model = require('./model')(conn_string);

  return {
    agencies:           require('./agencies')(model),
    api_keys:           require('./api_keys')(model),
    calendar_dates:     require('./calendar_dates')(model),
    directions:         require('./directions')(model),
    display_trips:      require('./display_trips'),
    recent_trips:       require('./recent_trips'),
    route_types:        require('./route_types')(model),
    routes:             require('./routes')(model),
    saved_trips:        require('./saved_trips'),
    shapes:             require('./shapes')(model),
    simplified_shapes:  require('./simplified_shapes')(model),
    simplified_stops:   require('./simplified_stops')(model),
    stats:              require('./stats')(model),
    stop_times:         require('./stop_times')(model),
    stops:              require('./stops')(model),
    trip_variants:      require('./trip_variants')(model),
    trips:              require('./trips')(model)
  };
};
