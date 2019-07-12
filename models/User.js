const mongoose = require('mongoose');
const Destination = require('./Destination.js')


const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	destinations: [{type: mongoose.Schema.Types.ObjectId, ref: 'destination'}]

})


module.exports = mongoose.model('user', UserSchema);
