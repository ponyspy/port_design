var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Work = Model.Work;

	module.index = function(req, res) {
		Work.where('status').ne('hidden').sort('-date').skip(0).limit(1).exec(function(err, works) {
			res.render('main/index.jade', { load: true, works: works });
		});
	};

	module.get_works = function(req, res) {
		var index = req.body.index;

		var opts = {
			compileDebug: false, debug: false, cache: true, pretty: false
		};

		Work.where('status').ne('hidden').sort('-date').skip(+index).limit(1).exec(function(err, works) {
			if (works.length > 0) {
				opts.works = works;
				res.send({ current: +index + 1, html: jade.renderFile(__app_root + '/views/main/_images.jade', opts) });
			} else {
				Work.find().sort('-date').skip(0).limit(1).exec(function(err, works) {
					opts.works = works;
					res.send({ current: 1, html: jade.renderFile(__app_root + '/views/main/_images.jade', opts) });
				});
			}
		});
	};

	return module;
};