module.exports = function(model) {
  return model.create('agencies', { dates:false, public_fields:['slug', 'agency_name'] });
};
