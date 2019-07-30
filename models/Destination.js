const mongoose = require('mongoose');
const User = require('./User.js')

//geolocation schema
const geoLocation = mongoose.Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number]
	}
})


const DestinationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	location: geoLocation,
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'user'
	}
});

module.exports = mongoose.model('destination', DestinationSchema)