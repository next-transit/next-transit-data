var stop_times = require('./stop_times'),
    display_trips = {};

display_trips.get_by_day = function(agency_id, is_rail, route_id, direction_id, from_id, to_id, day_of_week) {
  return new promise(function(resolve, reject) {
    stop_times.get_by_day(agency_id, is_rail, route_id, direction_id, from_id, day_of_week).then(function(times, count) {
      convert_list(agency_id, times, to_id, function(trips) {
        resolve(trips, count);
      });
    }, reject);
  });
};

display_trips.get_by_time = function(agency, is_rail, route_id, direction_id, from_id, offset, to_id, success, error) {
  stop_times.get_by_time(agency, is_rail, route_id, direction_id, from_id, offset, function(times) {
    convert_list(agency, times, to_id, function(trips) {
      success(trips);
    });
  }, error);
};

module.exports = exports = display_trips;
