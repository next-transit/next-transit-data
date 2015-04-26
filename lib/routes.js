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

function sort_by_short_name(routes) {
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
}

module.exports = function(model) {
  var routes = model.create('routes');
  routes.sort_by_short_name = sort_by_short_name;
  return routes;
};
