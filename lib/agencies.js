var model = require('./model');

module.exports = model.create('agencies', { dates:false, public_fields:['slug', 'agency_name'] });
