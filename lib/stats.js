module.exports = function(model) {
  return model.create('stats', { dates: { created_at:true } });
};
