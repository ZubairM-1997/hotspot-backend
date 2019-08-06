const jwt = require("jsonwebtoken")
const config = require("config");

module.exports = function(req, res, next) {
	//Get token from the header

	const token = req.header('x-auth-token');


	//check if its not a token
	if(!token) {
		res.status(401).json({message: "you are not authorized"});
	}

	try {


		const decoded = jwt.verify(token, config.get('jwtSecret'))
		req.user = decoded.user;
		next();

	} catch (err) {
		res.status(401).json({message: "token is not valid"});
	}
}