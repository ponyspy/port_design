var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;

	var uploadImages = Params.upload.images;


	module.index = function(req, res, next) {
		res.render('admin/works/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var work = new Work();

		work._short_id = shortid.generate();
		work.status = post.status;
		work.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		work.title = post.title;
		work.description = post.description;

		uploadImages(work, 'works', post.images, function(err, work) {
			if (err) return next(err);

			work.save(function(err, work) {
				if (err) return next(err);

				res.redirect('/admin/works');
			});
		});
	};


	return module;
};