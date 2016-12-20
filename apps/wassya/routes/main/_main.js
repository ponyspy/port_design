var express = require('express');

var Model = require(__app_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	content: require('./content.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)
		.post(main.index.get_works);

	router.route('/cv')
		.get(main.content.cv);

	return router;
})();