function seed(models, done) {
  models.agencies.insert({ agency_name:'trimet' }).commit();
  models.api_keys.insert({ key:'tr@s17' }).commit();
  models.calendar_dates.insert({}).commit();
  models.directions.insert({}).commit();
  models.route_types.insert({ slug:'catbus', label:'Catbus' }).commit();
  models.routes.insert({}).commit();
  models.shapes.insert({}).commit();
  models.simplified_shapes.insert({}).commit();
  models.simplified_stops.insert({}).commit();
  models.stats.insert({}).commit();
  models.stop_times.insert({}).commit();
  models.stops.insert({}).commit();
  models.trip_variants.insert({}).commit();
  models.trips.insert({}).commit(done);
}

module.exports = exports = {
  seed: seed
};
