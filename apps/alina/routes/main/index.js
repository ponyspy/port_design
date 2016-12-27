var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Work = Model.Work;

	module.index = function(req, res) {
		Work.where('status').ne('hidden').sort('-date').exec(function(err, works) {
			res.render('main/index.jade', { works: works });
		});
	};

	return module;
};