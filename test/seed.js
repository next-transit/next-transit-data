var date = require('../lib/utils/date');

var timezone = 'America/Los_Angeles';
var now = date.get_timezone_moment(timezone).add(5, 'minutes');
var date_str = date.format.date(now);

var route_type_id = 1; // Subways
var route_id = '15';
var direction_id = '0';
var trip_id = '1234';
var stop_id = '5678';
var service_id = '1';
var departure_time = date.format.time_next_day(now, 5);

function seed(models, done) {
  models.agencies.insert({ agency_name:'trimet', timezone:timezone }).commit(function(agency) {
    models.api_keys.insert({ agency_id:agency.id, key:'tr@s17' }).commit();
    models.calendar_dates.insert({ agency_id:agency.id, service_id:service_id, exact_date:date_str }).commit();
    models.directions.insert({ agency_id:agency.id, direction_id:direction_id }).commit();
    models.route_types.insert({ agency_id:agency.id, route_type_id:route_type_id, slug:'catbus', label:'Catbus' }).commit();
    models.routes.insert({ agency_id:agency.id, route_id:route_id }).commit();
    models.shapes.insert({ agency_id:agency.id }).commit();
    models.simplified_shapes.insert({ agency_id:agency.id }).commit();
    models.simplified_stops.insert({ agency_id:agency.id }).commit();
    models.stats.insert({ agency_id:agency.id }).commit();
    models.stop_times.insert({ agency_id:agency.id, trip_id:trip_id, stop_id:stop_id, departure_time:departure_time }).commit();
    models.stops.insert({ agency_id:agency.id, stop_id:stop_id }).commit();
    models.trip_variants.insert({ agency_id:agency.id }).commit();
    models.trips.insert({ agency_id:agency.id, route_id:route_id, direction_id:direction_id, trip_id:trip_id, service_id:service_id }).commit(function() {
      done(agency);
    });
  });
}

module.exports = exports = {
  route_type_id: route_type_id,
  route_id: route_id,
  direction_id: direction_id,
  trip_id: trip_id,
  stop_id: stop_id,
  generate: seed
};
