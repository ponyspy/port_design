var fs = require('fs');

exports.edit = function(req, res) {
	fs.readFile(__app_root + '/static/cv.html', function(err, content) {
		res.render('admin/cv.jade', { content: content });
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;

	fs.writeFile(__app_root + '/static/cv.html', post.content, function(err) {
		res.redirect('back');
	});
}