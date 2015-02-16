function parallel(fns, done) {
  var expect = fns.length,
      actual = 0;

  fns.forEach(function(fn) {
    fn(function() {
      if(++actual === expect && typeof done === 'function') {
        done();
      }
    });
  });
}

function setup(models, done) {
  var truncates = [];
  for(var model_name in models) {
    if(models[model_name].table) {
      truncates.push(models[model_name].truncate().commit); 
    }
  }
  parallel(truncates, done);
}

module.exports = exports = {
  setup: setup
};
