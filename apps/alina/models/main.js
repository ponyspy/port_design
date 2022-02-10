var mongoose = require('mongoose'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/' +  __app_name, {
	// useCreateIndex: true,
	// useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var workSchema = new Schema({
	title: { type: String, trim: true },
	s_title: { type: String, trim: true },
	description: { type: String, trim: true },
	status: String,
	poster: String,
	poster_hover: Boolean,
	images: [{
		size: Number,
		gallery: Boolean,
		description: { type: String, trim: true },
		original: String,
		thumb: String,
		preview: String
	}],
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});


// ------------------------
// *** Index Block ***
// ------------------------


workSchema.index({'title': 'text'});
workSchema.index({'date': -1});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Work = mongoose.model('Work', workSchema);