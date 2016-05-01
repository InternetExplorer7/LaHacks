const mongoose = require('mongoose');

// Create the Schema
const contactSchema = new mongoose.Schema({
	_id: String,
	firstName: String,
	lastName: String,
	profilePicture: String,
	nickName: String,
	groupIDs: [String]
});

// create the model
module.exports = mongoose.model('users', contactSchema);