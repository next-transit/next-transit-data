var assert = require('assert'),
    models = require('../lib')('postgres://reed:5432@localhost/next_transit_test');

function assert_has_results(done, expected_length) {
  if(typeof expected_length === 'undefined') expected_length = 1;
  return function(results) {
    assert.equal(results.length, expected_length);
    done();
  };
}

describe('next-transit-models', function() {
  var agency_trimet = 1;

  describe('agencies', function() {
    it('should find agencies', function(done) {
      models.agencies.select(assert_has_results(done, 2));
    });
  });

  describe('api_keys', function() {
    it('should find first api_key', function(done) {
      models.api_keys.select(agency_trimet).first(function(result) {
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
  });

  describe('routes', function() {
    it('should find routes', function(done) {
      models.routes.select(assert_has_results(done));
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
  });
});
