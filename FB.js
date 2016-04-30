const rp = require('request-promise');

const request = require('request');

const Promise = require('bluebird');

const token = 'EAALPsC93aHYBAL5HlQXgZBNVa47ECdQgrwXgfk9FKFQF5LdrB61h53yAdcbZC9Ed2uYrYQEIRmuucirclvZBm1gQ35uy4eMfrGX3an5hJeSgs2w4EBabHZAfs9CeCGmk88ktfJeUzIiiPkm7DcATzpQa2UHPwCJ1ZCwNlskj1OwZDZD';
exports.sendTextMessage = function(sender, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: {text: message.replace(/&#39;/g, '')}
        }
    });
}

exports.sendButtonTemplate = function(sender, cArray) { // pass in sender and array to loop over.
    const msg = [];
    Promise.try(function() {
       return cArray;
   }).each(function(group) {
       msg.push({
           title: group._id,
           subtitle: "This group currently has " + group.population + " active user(s).",
           buttons: [{
               type: "postback",
               title: "Join",
               payload: group._id
           }]
       })
   }).then(function (){
     const options = {
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: true,
        body: {
            recipient: {id: sender},
                "message": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": msg
                        }
                    }
                }
        }
     }
     rp(options);
   });
}

exports.getUserInformation = function (senderID){ // We need to send back a Promise.
    const options = {
        url: 'https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic&access_token=' + token
    }

    return rp(options)
        .then(function (data){
            return data;
        });
}

/*      request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
                "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Aryan Khorram",
                            "subtitle": "Hindu speaker looking to learn Italian.",
                            "buttons": [{
                                "type": "postback",
                                "title": "Connect",
                                "payload": "1003149739739049"
                            }]
                        }, {
                            "title": "Niko Bellic",
                            "subtitle": "French speaker looking to learn Japanese",
                            "buttons": [{
                                "type": "postback",
                                "title": "Connect",
                                "payload": "1003149739739049"
                            }]
                        }, {
                            "title": "Jessica Le",
                            "subtitle": "English speaker looking to learn French",
                            "buttons": [{
                                "type": "postback",
                                "title": "Connect",
                                "payload": "1003149739739049"
                            }]
                        }, {
                            "title": "Alfred Ban",
                            "subtitle": "French speaker looking to learn African",
                            "buttons": [{
                                "type": "postback",
                                "title": "Connect",
                                "payload": "1003149739739049"
                            }]
                        }]
                    }
                }
            }
        }
    });
*/

/*
{
                        "title": "Aryan Khorram",
                        "subtitle": "Hindu speaker looking to learn Italian.",
                        "buttons": [{
                            "type": "postback",
                            "title": "Connect",
                            "payload": "1003149739739049"
                        }]
                    }, {
                        "title": "Niko Bellic",
                        "subtitle": "French speaker looking to learn Japanese",
                        "buttons": [{
                            "type": "postback",
                            "title": "Connect",
                            "payload": "1003149739739049"
                        }]
                    }, {
                        "title": "Jessica Le",
                        "subtitle": "English speaker looking to learn French",
                        "buttons": [{
                            "type": "postback",
                            "title": "Connect",
                            "payload": "1003149739739049"
                        }]
                    }, {
                        "title": "Alfred Ban",
                        "subtitle": "French speaker looking to learn African",
                        "buttons": [{
                            "type": "postback",
                            "title": "Connect",
                            "payload": "1003149739739049"
                        }]
                    }

*/