const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const {check, validationResult} = require('express-validator');

const User = require('../models/User');
const Destination = require('../models/Destination');


// @route 		GET a api/destinations
// @desc 		get all destinations for a particular user
// @access 		Private
router.get('/', auth , async (req, res) => {
	try {

		//finds the destination that belongs to a particular user by finding the associated ID
		const destination = await Destination.find({ user: req.user.id })
		res.json(destination)

	} catch(err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
})


// @route 	POST 	api/destinations
// @desc 	Save a destination
// @access 		Private
router.post('/', [auth, [
	check('name', 'name of destination is required').not().isEmpty()
	]
] , async  (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array() });

	}

	const {name, location} = req.body

	try{
		const newDestination = new Destination({
			name,
			location,
			user: req.user.id
		});


		const destination = await newDestination.save();
		return res.status(200).json({name: destination.name, location: destination.location, _id: destination._id})

	} catch(err) {
		console.error(err.message)
		res.status(500).send('Server Error')

	}
});

process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', reason.stack || reason)
	// Recommended: send the information to sentry.io
	// or whatever crash reporting service you use
  })



// @route 	DELETE	api/destinations/:id
// @desc 	Save a destination
// @access 		Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let destination = await Destination.findById(req.params.id);

		if(!destination) return res.status(404).json({message: "Destination not found"})

		if(destination.user.toString() !== req.user.id ) {
			return res.status(401).json({message: "Not authorized"})
		}


		await Destination.findByIdAndRemove(req.params.id);
		res.json({message: "Your destination has been removed"})

	} catch(err) {
		console.error(err.message);
		res.status(500).send({message: "Server Error"})
	}

});

module.exports = router;