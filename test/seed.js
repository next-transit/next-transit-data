function seed(models, done) {
  var route_type_id = 1; // Subways
  var route_id = '15';
  var direction_id = '0';
  var trip_id = '1234';

  models.agencies.insert({ agency_name:'trimet' }).commit(function(agency) {
    models.api_keys.insert({ agency_id:agency.id, key:'tr@s17' }).commit();
    models.calendar_dates.insert({agency_id:agency.id }).commit();
    models.directions.insert({ agency_id:agency.id, direction_id:direction_id }).commit();
    models.route_types.insert({ agency_id:agency.id, route_type_id:route_type_id, slug:'catbus', label:'Catbus' }).commit();
    models.routes.insert({ agency_id:agency.id, route_id:route_id }).commit();
    models.shapes.insert({ agency_id:agency.id }).commit();
    models.simplified_shapes.insert({ agency_id:agency.id }).commit();
    models.simplified_stops.insert({ agency_id:agency.id }).commit();
    models.stats.insert({ agency_id:agency.id }).commit();
    models.stop_times.insert({ agency_id:agency.id, trip_id:trip_id }).commit();
    models.stops.insert({ agency_id:agency.id }).commit();
    models.trip_variants.insert({ agency_id:agency.id }).commit();
    models.trips.insert({ agency_id:agency.id, route_id:route_id, direction_id:direction_id, trip_id:trip_id }).commit(function() {
      done(agency);
    });
  });
}

module.exports = exports = {
  seed: seed
};
