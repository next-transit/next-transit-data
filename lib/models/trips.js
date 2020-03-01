const trips = require('./model').create('trips');

function get_longest_trip(trips, agency_id, route_id, direction_id) {
  return new Promise((resolve, reject) => {
    trips.select('t.id, t.route_id, t.trip_id, t.shape_id, count(st.*) stop_count')
      .join('stop_times st ON t.trip_id = st.trip_id AND st.agency_id = ?', agency_id)
      .where('t.agency_id = ?', agency_id)
      .where('t.direction_id = ?', direction_id)
      .where('t.route_id = ?', route_id)
      .group_by('t.id, t.route_id, t.trip_id, t.shape_id')
      .orders('stop_count DESC')
      .error(reject)
      .first(resolve);
  });
}
trips.get_longest_trip = (agency_id, route_id, direction_id) => {
  return get_longest_trip(trips, agency_id, route_id, direction_id);
};

module.exports = exports = trips;
