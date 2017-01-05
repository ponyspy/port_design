var rimraf = require('rimraf');
var runSequence = require('run-sequence');

var gulp = require('gulp'),
		util = require('gulp-util'),
		changed = require('gulp-changed'),
		rename = require('gulp-rename'),
		plumber = require('gulp-plumber'),
		sourcemaps = require('gulp-sourcemaps'),
		stylus = require('gulp-stylus'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		jshint = require('gulp-jshint');


// ENV Block


var Production = util.env.p || util.env.prod;
var Lint = util.env.l || util.env.lint;

console.log([
	'',
	'Lint ' + (Lint ? util.colors.underline.green('enable') : util.colors.underline.red('disable'))
					+ ', build in ' + (Production ? util.colors.underline.green('production') : util.colors.underline.yellow('development'))
					+ ' mode.',
	''
].join('\n'));


// Paths Block


var paths = {
	stylus: {
		src: 'apps/**/src/styl/*.styl',
		dest: 'public/build/css'
	},
	scripts: {
		src: 'apps/**/src/js/*.js',
		dest: 'public/build/js'
	},
	stuff: {
		src: 'apps/**/stuff/**',
		dest: 'public/stuff'
	},
	clean: '{' + 'public/build/**' + ',' + 'public/stuff/**' + '}'
};


// Decorators Block


var _ = function(flags, description, fn) {
	var flags = flags || { lint: false, dev: false, prod: false };

	fn.description = description;
	fn.flags = {};

	if (flags.lint)	fn.flags['-l --lint']	= 'Lint JavaScript code.';
	if (flags.dev) fn.flags['-d --dev'] = 'Builds in ' + util.colors.underline.yellow('development') + ' mode (default).';
	if (flags.prod) fn.flags['-p --prod'] = 'Builds in ' + util.colors.underline.green('production') + ' mode (minification, etc).'

	return fn;
}


// Loggers Block


var error_logger = function(error) {
	console.log([
		'',
		util.colors.bold.inverse.red('---------- ERROR MESSAGE START ----------'),
		'',
		(util.colors.red(error.name) + ' in ' + util.colors.yellow(error.plugin)),
		'',
		error.message,
		util.colors.bold.inverse.red('----------- ERROR MESSAGE END -----------'),
		''
	].join('\n'));
};

var watch_logger = function(event) {
	console.log('File ' + util.colors.green(event.path.replace(__dirname + '/', ''))
											+ ' was '
											+ util.colors.yellow(event.type)
											+ ', running tasks...');
};


// Tasks Block


gulp.task('clean', _(null, 'Delete dest folder', function(callback) {
	return rimraf(paths.clean, callback);
}));

gulp.task('build:stuff', _(null, 'Build Stuff files', function() {
	return gulp
		.src(paths.stuff.src)
		.pipe(changed(paths.stuff.dest))
		.pipe(plumber(error_logger))
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/stuff', '');
		}))
		.pipe(gulp.dest(paths.stuff.dest));
}));

gulp.task('build:stylus', _({ prod: true, dev: true }, 'Build Stylus', function() {
	return gulp
		.src(paths.stylus.src)
		.pipe(changed(paths.stylus.dest))
		.pipe(plumber(error_logger))
		.pipe(Production ? sourcemaps.init({ loadMaps: true }) : util.noop())
		.pipe(stylus({
			compress: Production
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: !Production
		}))
		.pipe(Production ? sourcemaps.write('.') : util.noop())
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/src/styl', '');
		}))
		.pipe(gulp.dest(paths.stylus.dest));
}));

gulp.task('build:scripts', _({ lint: true, prod: true, dev: true }, 'Build JavaScript', function() {
	return gulp
		.src(paths.scripts.src)
		.pipe(changed(paths.scripts.dest))
		.pipe(plumber(error_logger))
		.pipe(Lint ? jshint({ laxbreak: true, expr: true, '-W041': false }) : util.noop())
		.pipe(Lint ? jshint.reporter('jshint-stylish') : util.noop())
		.pipe(Production ? sourcemaps.init({ loadMaps: true }) : util.noop())
		.pipe(Production ? uglify() : util.noop())
		.pipe(Production ? sourcemaps.write('.', { mapSources: function(path) { return path.split('/').slice(-1)[0]; } }) : util.noop())
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/src/js', '');
		}))
		.pipe(gulp.dest(paths.scripts.dest));
}));

gulp.task('build', ['build:stylus', 'build:scripts', 'build:stuff']);

gulp.task('watch', _(null, 'Watch files and build on change', function() {
	gulp.watch(paths.scripts.src, ['build:scripts']).on('change', watch_logger);
	gulp.watch(paths.stylus.src, ['build:stylus']).on('change', watch_logger);
	gulp.watch(paths.stuff.src, ['build:stuff']).on('change', watch_logger);
}));


// Run Block


gulp.task('default',  function(callback) {
	runSequence('clean', 'build', callback);
});