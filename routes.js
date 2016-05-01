const db = require('./db');

const FB = require('./FB');

const userModel = require('./models/users');

const Promise = require('bluebird');

const natural = require('natural');

exports.start = function (sender, text){
	// Case #1: User is sending in event/city/location name.
	// Case #2: User is already in group chat.
	Promise.try(function (){
		return db.fetchUser(sender) // Gets user document
	}).then(function (user){
		if(user.groupIDs.length < 1){
			search(sender, text, user);
		} else {
			const command = text.substring(1).toLowerCase();
			if(text.includes('/') && text.length === 3){
				actions.requestUser(user, command);
			} else if (text.includes('/')){
				switch (command){
				case "help":
					actions.help(sender);
					break;
			}
		} else {
				 process_chat(sender, text, user); // For sending message to all users
			}
		}
	});
}

const actions = {
	help: (sender) => {
		FB.sendTextMessage(sender, "Hi\n\nIt is pretty simple to get started wth infinite.\n\n1) Tell me where you are, and I will automatically connect you.\n\n2) If you want to leave a group, simply use `/leave`\n\n")
	},
	requestUser: (user, command)  => {
		Promise.try(function (){
			return userModel.find({nickName: command.toUpperCase()}) // Returns users document.
		}).then(function (m){
			console.log('f: ' + m[0]._id + '. user: ' + user);
			FB.sendButtonARTemplate(m[0]._id, user) // sendButtonARTemplate
		});
	}
}

function process_chat(sender, text, user){
	var elem;
	Promise.try(function (){
		return db.fetchGroup(user.groupIDs[0]); // Gets group
	}).then(function (group){
		return group.users;
	}).each(function (user){ // Find user in group array and remove. make sure to save.
		if(sender === parseInt(user.senderID)){
			elem = user; // .nickName
			return user;
		}
	}).each(function (user){
		if(sender !== parseInt(user.senderID)){
			FB.sendChatTextMessage(user.senderID, elem.nickName, text, user.rProfilePicture); // senderid, title, subtitle, image
		}
	})
}

function search(sender, text, user){
	Promise.try(function (){
		return db.fetchAllGroups();
	}).then(function (aG){
		if(aG.length < 1){ // No groups found (at all).
			db.createGroup(sender, text, user);
			db.addGroupIDToUser(sender, text); // text is the _id of the group
			FB.sendTextMessage(sender, "Congrats, you're now the proud group organizer for " + text);
		} else { // Groups found, start search.
			expandedSearch(sender, text, user, aG);
		}
	});
}

function expandedSearch(sender, text, user, aG){ // senderID, text, user, allGroups
	Promise.try(function (){
		return aG;
	}).filter(function (group){
		if(natural.JaroWinklerDistance(text, group._id) > 0.40){
			return true;
		} else {
			return false;
		}
	}).then(function (cArray){ // Array of matching groups.
		if(cArray.length < 1){ // array is empty
			db.createGroup(sender, text, user); // create that new group.
			db.addGroupIDToUser(sender, text); // Add that groupID to the user, since they're the ones setting up the event.
			FB.sendTextMessage(sender, "Congrats, you're now the proud group organizer for " + text);
		} else {
			FB.sendButtonTemplate(sender, cArray); // Send found groups. :-)
		}
	});
}