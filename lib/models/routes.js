var route_types = require('./route_types'),
    routes = require('./model').create('routes');

function pad_left(str, size, char) {
  if(str.length < size) {
    var i = 0, len = size - str.length, pad = '';
    for(; i < len; i++) {
      pad += char;
    }
    str = pad + str;
  }
  return str;
}

routes.sort_by_short_name = function(routes) {
  routes.sort(function(a, b) {
    a.cid = a.cid || pad_left(a.route_short_name, 4, '0');
    b.cid = b.cid || pad_left(b.route_short_name, 4, '0');

    if(a.cid < b.cid) {
      return -1;
    } else if(a.cid > b.cid) {
      return 1;
    }
    return 0;
  });
};


routes.process = function(route, callback) {
  if(route) {
    var route_id = route.route_id || '';
    var route_short_name = route.route_short_name || '';
    var custom_type_slug = route_short_name.toLowerCase();

    route_types.get_by_route_type_id(route.agency_id, route.route_type, custom_type_slug, function(route_type, custom_route_type) {
      route.is_rail = route.route_type === 2;
      route.has_realtime = route.route_type !== 1;
      route.route_name = route.is_rail ? route_id : route.route_short_name;
      route.slug = route.is_rail ? route_id.toLowerCase() : route_short_name.toLowerCase();

      if(route_type) {
        route.route_type_slug = route_type.slug;
        route.color = route_type.color; 
      }

      if(custom_route_type) {
        route.color = custom_route_type.color;
      }
      callback(route);
    });
  } else {
    callback();
  }
};

module.exports = exports = routes;
