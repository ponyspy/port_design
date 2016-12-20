var fs = require('fs');

exports.cv = function(req, res) {
	var html = fs.readFile(__app_root + '/static/cv.html', function(err, html) {
		res.render('main/cv.jade', { html: html });
	});
}