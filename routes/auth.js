const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const config = require("config")
const auth = require('../middleware/auth.js')
const jwt = require('jsonwebtoken')
const User = require("../models/User.js")


// @route 	GET 	api/auth
// @desc 	Get logged in user
// @access 		Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);


	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error');

	}
});


// @route 	POST	api/auth
// @desc 	auth user and get token
// @access 		Public
router.post('/', [
	check('email', 'Please enter a valid email').isEmail(),
	check('password', 'password is required').exists()


], async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array() });
	}

	const {email, password} = req.body;

	try {
		let user = await User.findOne({ email});

		if(!user) {
			return res.status(400).json({message: "Invalid details"})
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch) {
			return res.status(400).json({message: "passwords dont match!"})

		}

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
		console.err(err.message)
		res.status(500).send('server error')
	}
});


module.exports = router;