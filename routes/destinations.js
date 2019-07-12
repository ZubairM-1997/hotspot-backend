const express = require('express');
const router = express.Router();



// @route 		GET a api/destinations
// @desc 		get all of the users destinations
// @access 		Private
router.get('/', (req, res) => {
	res.send('Get all of users destinations')
})






// @route 	POST 	api/destinations
// @desc 	Save a destination
// @access 		Private
router.post('/', (req, res) => {
	res.send('Add a destination')
});








// @route 	DELETE	api/destinations/:id
// @desc 	Save a destination
// @access 		Private
router.delete('/:id', (req, res) => {
	res.send('Delete a destination')
});

module.exports = router;