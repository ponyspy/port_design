var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var work = Model.Work;

	var previewImages = Params.upload.preview;
	var uploadImages = Params.upload.images;
	var uploadPoster = Params.upload.image;


	module.index = function(req, res, next) {
		var id = req.params.work_id;

		work.findById(id).exec(function(err, work) {
			if (err) return next(err);

			previewImages(work.images, function(err, images_preview) {
				if (err) return next(err);

				res.render('admin/works/edit.jade', { work: work, images_preview: images_preview });
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;
		var id = req.params.work_id;

		work.findById(id).exec(function(err, work) {
			if (err) return next(err);

			work.status = post.status;
			work.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			work.title = post.title;
			work.s_title = post.s_title;
			work.description = post.description;
			work.poster_hover = post.poster_hover;

			uploadImages(work, 'works', post.images, function(err, work) {
				if (err) return next(err);

				uploadPoster(work, 'works', 'poster', file, post.poster_del, function(err, work) {
					if (err) return next(err);

					work.save(function(err, work) {
						if (err) return next(err);

						res.redirect('/admin/works');
					});
				});
			});
		});
	};


	return module;
};