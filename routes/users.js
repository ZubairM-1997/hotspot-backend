const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const User = require("../models/User.js")
const config = require("config")
const auth = require('../middleware/auth')

const Destination = require('../models/Destination');



// @route 	GET 	api/users
// @desc 	get all users from database
// @access 		Private
router.get('/', auth,  async (req, res) => {
	try {
		const users = await User.find({})
		res.json(users)

	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error')
	}
});



// @route 	POST 	api/users
// @desc 	Register a user
// @access 		Public


//handling post request with validations
//makes sure that the name, email and password are present

router.post('/', [
	check('name', 'Please enter your name').not().isEmpty(),
	check('email', 'Please enter a valid email').isEmail(),
	check('password', 'please enter a password with 6 or more characters').isLength({min: 6})
], async (req, res) => {


	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		console.log("ERROR")
		return res.status(400).json({errors: errors.array() });
	}

	const {name, email, password} = req.body;

	try {
		let user = await User.findOne({ email});

		if(user) {

			return res.status(400).json({message: "User already exists", status: 400});
		}



		user = new User({
			name,
			email,
			password
		})

		const salt = await bcrypt.genSalt(10)

		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(payload, config.get('jwtSecret'), {
			expiresIn: 360000
		}, (err, token) => {
			if(err) throw err;
			res.json({token});
		} )

	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error")

	}


}
);

process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', reason.stack || reason)
	// Recommended: send the information to sentry.io
	// or whatever crash reporting service you use
  })




module.exports = router;