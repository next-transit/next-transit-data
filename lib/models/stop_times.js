const date = require('../utils/date')
const stop_times = require('./model').create('stop_times');

var DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function get_stops(agency_id, route_id, direction_id, from_id, day_of_week, date_str, compare_time, compare_dir, sort_dir, limit, offset) {
  return new Promise((resolve, reject) => {
    sort_dir = sort_dir || 'asc';
    limit = limit || 0;
    offset = offset || 0;

    var q = stop_times.select('DISTINCT st.*, t.block_id, tv.stop_count, tv.first_stop_sequence, tv.last_stop_sequence')
      .join('trips t ON st.trip_id = t.trip_id AND t.agency_id = ?', agency_id)
      .join('trip_variants tv ON t.trip_variant_id = tv.id', [], 'LEFT OUTER JOIN')
      .where('st.agency_id = ?', agency_id)
      .where('t.route_id = ?', route_id)
      .where('stop_id = ?', from_id)
      .where('t.direction_id = ?', direction_id)
      .where_if('t.service_id IN (SELECT service_id FROM calendar_dates cd WHERE cd.agency_id = ? AND (cd.exact_date = ? OR (' + day_of_week + ' = true AND cd.start_date <= ? AND cd.end_date > ?)))', [agency_id, date_str, date_str, date_str], date_str)
      .where_if('t.service_id IN (SELECT service_id FROM calendar_dates cd WHERE cd.agency_id = ? AND ' + day_of_week + ' = true', [], !date_str)
      .where_if('st.departure_time ' + compare_dir + ' ?', [compare_time], compare_time)
      .orders('st.departure_time ' + sort_dir)
      .error(reject);

    if(limit) {
      q.limit(limit).offset(Math.abs(offset));
    } else {
      q.count(true);
    }

    q.commit((times, count) => {
      if(sort_dir === 'desc') {
        times.reverse();
      }
      resolve(times, count);
    });
  });
};

stop_times.get_by_day = function(agency, is_rail, route_id, direction_id, from_id, day_of_week) {
  return new Promise((resolve, reject) => {
    let now = date.get_timezone_moment(agency.timezone);
    let date_str;
    let dow_string_idx;
    let dow_offset;

    if(typeof day_of_week === 'string') {
      dow_string_idx = DAYS.indexOf(day_of_week);
      if(dow_string_idx > -1) {
        day_of_week = dow_string_idx;
      }
    }
    if(typeof day_of_week !== 'number' || day_of_week < 0 || day_of_week > 6) {
      day_of_week = now.day();
    }

    // Sets formatted date string to closest relative to current date
    // Needs to be an actual date and not just a day of the week because 
    // GTFS calendar dates change throughout the year
    // Maybe should always be "add"
    if(day_of_week !== now.day()) {
      dow_offset = day_of_week - now.day();
      now = now.add(dow_offset, 'days');
    }

    date_str = date.format.date(now);

    get_stops(agency.id, route_id, direction_id, from_id, DAYS[day_of_week], date_str).then(resolve, reject);
  });
};

stop_times.get_by_time = function(agency, is_rail, route_id, direction_id, from_id, offset, limit) {
  return new Promise((resolve, reject) => {
    const now = date.get_timezone_moment(agency.timezone).subtract(5, 'minutes');
    const day_of_week = date.format.day_of_week(now).toLowerCase();
    const date_str = date.format.date(now);
    const compare_time = date.format.time_next_day(now, 5);

    let sort_dir = 'asc';
    let compare_dir = '>';

    limit = limit || 5;

    // handles "backwards" paging
    // if a negative offset is detected, we reverse the time comparison, reverse the sort order, and then reverse the results
    if(offset) {
      if(offset < 0) {
        offset += 5; // this is because an offset of -5 actually means reverse order and start from 0
        sort_dir = 'desc';
        compare_dir = '<';
      }

      offset = Math.abs(offset);
    }

    get_stops(agency.id, route_id, direction_id, from_id, day_of_week, date_str, compare_time, compare_dir, sort_dir, limit, offset).then(resolve, reject);
  });
};

module.exports = stop_times;
