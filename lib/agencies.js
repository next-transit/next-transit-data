module.exports = function(model) {
  return model.create('agencies', { public_fields:['slug', 'agency_name'] });
};
