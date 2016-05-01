const db = require('./db');

const FB = require('./FB');

const Promise = require('bluebird');

const natural = require('natural');

exports.start = function (sender, text){
	// Case #1: User is sending in event/city/location name.
	// Case #2: User is already in group chat.
	Promise.try(function (){
		return db.fetchUser(sender) // Gets user document
	}).then(function (user){
		if(user.groupIDs.length < 1){
			// If not in any groups, they are most likely:
			// 1) Searching for group by name.
				// 2) If not found, create group.
			// TODO: Implement search algo here.
			search(sender, text, user);
		} else {
			// Already in group.
			// 1) Check for commands.
				// 2) Fetch users' groupID to find group document.
				// 3) Using group document, loop through each...
				// 4) ..
			process_chat(sender, text, user);
		}
	});
}



function process_chat(sender, userInput, user){
	var elem;
	Promise.try(function (){
		return db.fetchGroup(user.groupIDs[0]); // Gets group
	}).then(function (group){
		return group.users;
	}).each(function (user){ // Find user in group array and remove. make sure to save.
		if(sender === parseInt(user.senderID)){
			elem = user.nickName;
			return user;
		}
	}).each(function (user){
		if(sender !== parseInt(user.senderID)){
            if (userInput.message.attachment===null &&  
                userInput.message.payload===null){
                FB.sendTextMessage(user.senderID, elem + ' ' + text);
            }
            else {
                FB.sen
            }
			
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
		if(natural.JaroWinklerDistance(text, group._id) > 0.70){
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

//check content type
function isText(userInput){
    if (userInput.message.attachment===null && userInput.message.payload===null)
        return true;
    }
}
function isImage(userInput){
    return userInput typeof === 'URL';
}
