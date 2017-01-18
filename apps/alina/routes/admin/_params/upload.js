var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var public_path = __glob_root + '/public';
var preview_path = __glob_root + '/public/preview/';

module.exports.image = function(obj, base_path, field_name, file, del_file, callback) {
	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name]);
		obj[field_name] = undefined;
		obj.poster_hover = undefined;
	}
	if (!file) return callback.call(null, null, obj);

	var dir_path = '/cdn/' + __app_name + '/images/' + base_path + '/' + obj._id;
	var file_name = field_name + '.' + mime.extension(file.mimetype);

	mkdirp(public_path + dir_path, function() {
		fs.rename(file.path, public_path + dir_path + '/' + file_name, function(err) {
			obj[field_name] = dir_path + '/' + file_name;
			callback.call(null, null, obj);
		});
	});

};

module.exports.images = function(obj, base_path, upload_images, callback) {
	obj.images = [];
	var images = [];

	var dir_path = '/cdn/' + __app_name + '/images/' + base_path + '/' + obj._id;

	var images_path = {
		original: dir_path + '/original/',
		thumb: dir_path + '/thumb/',
		preview: dir_path + '/preview/'
	};

	var map_paths = Object.values(images_path).map(function(path) { return public_path + path; });

	rimraf('{' + map_paths.join(',') + '}', { glob: true }, function(err, paths) {

		if (!upload_images) return callback.call(null, null, obj);

		async.concatSeries(map_paths, mkdirp, function(err, dirs) {

			async.eachOfSeries(upload_images.path, function(item, i, callback) {
				images[i] = { path: null, description: [] };
				images[i].path = upload_images.path[i];
				images[i].description = upload_images.description[i];
				images[i].size = upload_images.size[i];
				images[i].gallery = upload_images.gallery[i];

				callback();

			}, function() {

				async.eachSeries(images, function(image, callback) {
					var name = path.basename(image.path).split('.')[0] || Date.now();
					var original_path = images_path.original + name + '.jpg';
					var thumb_path = images_path.thumb + name + '.jpg';
					var preview_path = images_path.preview + name + '.jpg';

					gm(public_path + image.path).write(public_path + original_path, function(err) {
						gm(public_path + image.path).resize(400, false).quality(60).write(public_path + preview_path, function(err) {
							gm(public_path + image.path).size({bufferStream: true}, function(err, size) {
								this.resize(size.width > 1000 ? 1000 : false, false);
								this.quality(size.width > 1000 ? 80 : 100);
								this.write(public_path + thumb_path, function(err) {
									var obj_img = {};

									obj_img.original = original_path;
									obj_img.thumb = thumb_path;
									obj_img.preview = preview_path;

									obj_img.description = image.description;
									obj_img.size = image.size;
									obj_img.gallery = image.gallery;

									obj.images.push(obj_img);

									callback();
								});
							});
						});
					});
				}, function() {
					callback.call(null, null, obj);
				});

			});

		});
	});
};

module.exports.preview = function(images, callback) {

	async.mapSeries(images, function(image, callback) {
		var image_path = public_path + image.original;
		var image_name = path.basename(image.original);

		fs.createReadStream(image_path).pipe(fs.createWriteStream(preview_path + image_name));

		callback(null, '/preview/' + image_name);
	}, function(err, results) {
		callback.call(null, null, results);
	});
};