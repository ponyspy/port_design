var figlet = require('figlet');

exports.index = function(req, res, next) {
	figlet.fonts(function(err, fonts) {
		if (err) return next(err);

		var font = fonts[Math.floor(Math.random() * fonts.length)];

		figlet('WASSYA\nSTARGAZER', {font: font, horizontalLayout: 'default', verticalLayout: 'default'}, function(err, data) {
			if (err) return next(err);

			res.render('admin/index.jade', {data: data, font: font});
		});
	});
};