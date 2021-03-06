const groupModel = require('./models/groups');

const userModel = require('./models/users');

const Promise = require('bluebird');

const FB = require('./FB');

/* ================================================ */
/*                     USERS                        */
/* ================================================ */


exports.userExists = function (sender){
	return userModel.findById(sender)
		.then(function (m){
			if(m){
				return true;
			} else {
				return false;
			}
		});
}

exports.fetchFBDataAndSaveToUser = function (sender){
	Promise.try(function (){
		return FB.getUserInformation(sender)
	})
	.then(function (uD){ // userData
		uD = JSON.parse(uD); // Parse to valid JSON.
		const newRegister = new userModel({
			_id: sender,
			firstName: uD.first_name,
			lastName: uD.last_name,
			profilePicture: uD.profile_pic,
			nickName: uD.first_name.substring(0,1) + uD.last_name.substring(0,1)
		})
		newRegister.save();
	})
}

exports.fetchUser = function (sender) {
	return userModel.findById(sender)
		.then(function (m){
			return m;
		});
}

exports.addGroupIDToUser = function (sender, id){
	return userModel.findById(sender)
		.then(function (m){
			m.groupIDs.push(id);
			m.save();
		});
}

/* ================================================ */
/*                     GROUPS                       */
/* ================================================ */

exports.fetchAllGroups = function (sender) {
	return groupModel.find()
		.then(function (aG){
			return aG;
		});
}

exports.fetchGroup = function (sender){
	return groupModel.findById(sender)
		.then(function (aG){
			return aG;
		});
}

const arrOfR = ['animalsicons-01.png', 'animalsicons-02.png', 'animalsicons-03.png'];
exports.updateGroup = function (id, user){
	groupModel.findById(id)
		.then(function (g){
			g.population++;
			var newObj = {
				senderID: user._id,
				nickName: '^' + user.firstName.substring(0,1) + user.lastName.substring(0,1),
				profilePicture: user.profilePicture,
				firstName: user.firstName,
				lastName: user.lastName,
				rProfilePicture: arrOfR[0]
			}
			g.users.push(newObj);
			g.save().then(function (nG){
				console.log(nG);
			})

		});
}

exports.createGroup = function (sender, text, user){
	var newGroup = new groupModel({
		_id: text,
		population: 1,
		users: [],
		conversation: ''
	})
		var newObj = {
			senderID: user._id,
			nickName: '^' + user.firstName.substring(0,1) + user.lastName.substring(0,1),
			profilePicture: user.profilePicture,
			firstName: user.firstName,
			lastName: user.lastName,
			rProfilePicture: arrOfR[1]
		}
	newGroup.users.push(newObj);
	newGroup.save().then(function (nG){
		console.log(nG);
	});
}