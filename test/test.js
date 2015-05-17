var assert = require('assert'),
    config = require('../config/local.json'),
    models = require('../lib')(config.test_database_path),
    setup = require('./setup'),
    seed = require('./seed');

function assert_has_results(done, expected_length) {
  if(typeof expected_length === 'undefined') expected_length = 1;
  return function(results) {
    assert.equal(results.length, expected_length, 'assert_has_results failed');
    done();
  };
}

describe('next-transit-models', function() {
  var agency_trimet = 1,
      seed_agency;

  before(function(done) {
    setup.setup(models, function() {
      seed.seed(models, function(agency) {
        seed_agency = agency;
        done();
      });
    });
  });

  describe('agencies', function() {
    it('should find agencies', function(done) {
      models.agencies.select(assert_has_results(done, 1));
    });
  });

  describe('api_keys', function() {
    it('should find first api_key', function(done) {
      models.api_keys.select().first(function(result) {
        assert.equal(typeof result, 'object');
        done();
      });
    });
  });

  describe('calendar_dates', function() {
    it('should find calendar dates', function(done) {
      models.calendar_dates.select(assert_has_results(done));
    });
  });

  describe('directions', function() {
    it('should find directions', function(done) {
      models.directions.select(assert_has_results(done));
    });
  });

  describe('route_types', function() {
    it('should find route types', function(done) {
      models.route_types.select(assert_has_results(done));
    });

    it('should get get_by_agency_id', function(done) {
      models.route_types.get_by_agency_id(seed_agency.id, assert_has_results(done));
    });

    it('should get get_by_route_type_id', function(done) {
      models.route_types.get_by_route_type_id(seed_agency.id, 1, null, function(route_type, custom_route_type) {
        assert(typeof route_type, 'object');
        done();
      });
    });

    it('should get get_by_slug', function(done) {
      models.route_types.get_by_slug(seed_agency.id, 'catbus', function(route_type) {
        assert(typeof route_type, 'object');
        done();
      });
    });
  });

  describe('routes', function() {
    it('should find routes', function(done) {
      models.routes.select(assert_has_results(done));
    });

    it('should post-process results', function(done) {
      models.routes.select(function(results) {
        assert(typeof results[0].is_rail, 'boolean');
        done();
      });
    });
  });

  describe('shapes', function() {
    it('should find shapes', function(done) {
      models.shapes.select(assert_has_results(done));
    });
  });

  describe('simplified_shapes', function() {
    it('should find simplified shapes', function(done) {
      models.simplified_shapes.select(assert_has_results(done));
    })
  });

  describe('simplified_stops', function() {
    it('should find simplified stops', function(done) {
      models.simplified_stops.select(assert_has_results(done));
    });
  });

  describe('stats', function() {
    it('should find stats', function(done) {
      models.stats.select(assert_has_results(done));
    });
  });

  describe('stop_times', function() {
    it('should find stop_times', function(done) {
      models.stop_times.select(assert_has_results(done));
    });
  });

  describe('stops', function() {
    it('should find stops', function(done) {
      models.stops.select(assert_has_results(done));
    });
  });

  describe('trip_variants', function() {
    it('should find trip_variants', function(done) {
      models.trip_variants.select(assert_has_results(done));
    });
  });

  describe('trips', function() {
    it('should find trips', function(done) {
      models.trips.select(assert_has_results(done));
    });

    it('should find longest trip', function(done) {
      models.agencies.select().first(function(agency) {
        models.routes.select().first(function(route) {
          models.trips.get_longest_trip(agency.id, route.route_id, '0').then(function(trip) {
            assert.equal(typeof trip, 'object');
            done();
          }, function(err) {
            console.error(err);
          });
        });
      });
    });
  });
});
