var express = require('express');

var Model = require(__app_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	works: require('./works.js')(Model),
	content: require('./content.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)

	router.route('/works/:short_id')
		.get(main.works.index);

	router.route('/cv')
		.get(main.content.cv);

	return router;
})();