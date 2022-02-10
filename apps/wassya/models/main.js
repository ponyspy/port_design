var mongoose = require('mongoose'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1/' +  __app_name, {
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
	status: String,
	images: [{
		position: String,
		marquee: String,
		description: { type: String, trim: true },
		original: String,
		thumb: String
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