module.exports = function(Model) {
	var module = {};

	var Work = Model.Work;

	module.index = function(req, res) {
		var short_id = req.params.short_id;

		Work.findOne({ _short_id: short_id }).exec(function(err, work) {
			res.render('main/work.jade', { work: work });
		});
	};

	return module;
};