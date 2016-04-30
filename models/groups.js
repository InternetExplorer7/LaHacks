const mongoose = require('mongoose');

// Create the Schema
const contactSchema = new mongoose.Schema({
	_id: String,
	population: Number,
	users: [{
		senderID: String,
		nickName: String,
		profilePicture: String,
		firstName: String,
		lastName: String,
		rProfilePicture: String
	}],
	conversation: [String]
});

// create the model
module.exports = mongoose.model('groups', contactSchema);