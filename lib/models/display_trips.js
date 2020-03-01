const moment = require('moment-timezone');
const date_utils = require('../utils/date');
const stop_times = require('./stop_times');

const machine_format = 'YYYY-MM-DD HH:mm';
const time_format = 'h:mm a';
const display_trips = {};

function DisplayTrip(stop_time) {
  stop_time = stop_time || {};
  this.trip_id = stop_time.trip_id || '';
  this.block_id = stop_time.block_id || '';
  this.departure_stop_time = stop_time || null;
  this.departure_time_formatted = '';
  this.arrival_stop_time = null;
  this.arrival_time_formatted = '';
  this.from_now = '';
  this.gone = false;
  this.coverage = {
    left: ((stop_time.first_stop_sequence - 1) / stop_time.stop_count) * 100,
    right: (1 - (stop_time.last_stop_sequence / stop_time.stop_count)) * 100
  };

  if(this.coverage.left < 0) {
    this.coverage.left = 0;
  }
  if(this.coverage.right < 0) {
    this.coverage.right = 0;
  }

  this.coverage.full = !this.coverage.left && !this.coverage.right;
}

function add_to_stop_time(agency_id, now, trip, to_id) {
  return new Promise((resolve, reject) => {
    if(to_id) {
      stop_times.select()
        .where('agency_id = ? AND trip_id = ? AND stop_id = ?', [agency_id, trip.trip_id, to_id])
        .first(function(to_stop_time) {
          if(to_stop_time) {
            trip.arrival_stop_time = to_stop_time;
            trip.arrival_time_formatted = date_utils.time_str_to_date(now, to_stop_time.departure_time).format(time_format);
          }
          resolve(trip);
        });
    } else {
      resolve(trip);  
    }
  });
}

function convert(agency, now, stop_time, to_id) {
  const trip = new DisplayTrip(stop_time);
  const departure_datetime = date_utils.time_str_to_date(now, stop_time.departure_time);

  trip.departure_datetime = departure_datetime.format(machine_format);
  trip.departure_time_formatted = departure_datetime.format(time_format);
  trip.from_now = date_utils.from_now(departure_datetime, now);
  trip.gone = trip.from_now === 'GONE';

  return add_to_stop_time(agency.id, now, trip, to_id);
}

function convert_list(agency, stop_times, to_id, callback) {
  const now = moment().tz(agency.timezone || 'America/New_York');

  const promises = stop_times.map((stop_time) => {
    return convert(agency, now, stop_time, to_id);
  });

  Promise.all(promises).done((trips) => {
    callback(trips);
  });
}

display_trips.get_by_day = function(agency, is_rail, route_id, direction_id, from_id, to_id, day_of_week) {
  return new Promise((resolve, reject) => {
    stop_times.get_by_day(agency, is_rail, route_id, direction_id, from_id, day_of_week).then((times, count) => {
      convert_list(agency, times, to_id, (trips) => {
        resolve(trips, count);
      });
    }, reject);
  });
};

display_trips.get_by_time = function(agency, is_rail, route_id, direction_id, from_id, offset, limit, to_id) {
  return new Promise((resolve, reject) => {
    stop_times.get_by_time(agency, is_rail, route_id, direction_id, from_id, offset, limit).then((times) => {
      convert_list(agency, times, to_id, (trips) => {
        resolve(trips);
      });
    }, reject);
  });
};

module.exports = display_trips;
