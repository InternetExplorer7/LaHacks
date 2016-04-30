const express = require('express');

const app = express();

const routes = require('./routes');

const db = require('./db');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Promise = require('bluebird');

const FB = require('./FB');

const cfenv = require('cfenv');
// get the app environment from Cloud Foundry
const appEnv = cfenv.getAppEnv();


mongoose.connect("mongodb://localhost:27017/inf"); // mongodb://localhost:27017/weatherBot

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'EAALPsC93aHYBAL5HlQXgZBNVa47ECdQgrwXgfk9FKFQF5LdrB61h53yAdcbZC9Ed2uYrYQEIRmuucirclvZBm1gQ35uy4eMfrGX3an5hJeSgs2w4EBabHZAfs9CeCGmk88ktfJeUzIiiPkm7DcATzpQa2UHPwCJ1ZCwNlskj1OwZDZD') {
    res.send(req.query['hub.challenge']);
  }
  	res.send('Error, wrong validation token');
})
var isText = false;
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
    	isText = true;
      text = event.message.text;
      console.log(text);
      db.userExists(sender)
      	.then(function (doesExist){
      		if(doesExist){
      			routes.start(sender, text); // Already users, kick off app.
      		} else {
      			db.fetchFBDataAndSaveToUser(sender); // Save that user
      			FB.sendTextMessage(sender, "Hello, welcome to Infinite, tell us a event/location to join is on the conversation. (ex. LA Hacks 2016)!");
      		}
      	});
    } else if(event.postback && event.postback.payload){ //payload includes senderId and group_id for user to join.
    	var group_id = event.postback.payload;
    	isText = false;
    	db.fetchUser(sender)
    		.then(function (user){
    			user.groupIDs.push(id); // Add group to user document.
				user.save(); // save.
				db.updateGroup(sender, user);
    		});
    	// TODO: Fetch last 10 messages.
    	// FB.sendTextMessage("Welcome to " + )
    	// User has pressed this, cases to handle:
    	// 1) User has pressed button to join group
		// 2) User has pressed button to get profile from nickname
		// 3) User has recieved a exchange request template and hits a button.
    }
  }
  	if(isText){
		res.sendStatus(200); // Text, send back 200 (OKAY) response.
	}
});

app.listen(3000);