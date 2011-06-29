/**********************************************
 * CONFIGURATION
**********************************************/

// Server data

var server			= "localhost:3000"; // example: localhost:3000 || other example: 210.23.24.25:3000
var serverMount		= "faye";
var chatChannel		= "/chat";

// Chat references

var chat			= $("#chat");
var message			= $("#message");
var submit			= $("#submit");
var conversation	= $("#container ul");
var nicknameDefault	= "anonymous";
var nickname		= nicknameDefault;
var date			= new Date();



/**********************************************
 * CONNECTING APP TO THE SERVER
**********************************************/

// Create faye client

var client			= new Faye.Client('http://' + server + '/' + serverMount );

client.connect(function(){
	pushNotification(nickname);
});

// Subscribe to channel & set update actions

client.subscribe(chatChannel, function(response) {
	updateChat(response.msg, response.nick);
});



/**********************************************
 * MANAGEMENT & INTERACTIONS OF THE APP
**********************************************/

$(document).ready(function() {
	// put off "disabled" mode on form elements
	message.removeAttr('disabled');
	submit.removeAttr('disabled');
	
	message.focus(); // Put focus on chat input

	// Request for a nickname
	
	nickname = prompt("Pick a NICKNAME, please!:", nicknameDefault);
	if(nickname == null) nickname = nicknameDefault;
	
	// Event: submitting a new message

	chat.submit(function(e) {
		pushMessage(message.val(), nickname);
		e.preventDefault(); // Prevent default's form action
	});
});



/**********************************************
 * METHODS
**********************************************/

// Send message to all connected clients

var pushMessage = function(message, nickname) {
	if(message != false) // We won't send empty strings
		client.publish(chatChannel, {
			msg: message,
			nick: nickname
		});
	
	this.message.val(""); // empty the input
}

// Notify to all when new user joins

var pushNotification = function(nickname) {
	var message	= "has join the channel";
	client.publish(chatChannel, {msg: message, nick: nickname});
}

// Notify to all when user leaves

/* todo */

// Update the list of messages

var updateChat = function(msg, nick) {
	var time	= date.getHours() + ':' + date.getMinutes();
	msg			= escape(msg); // Escape and append the new message
	
	this.conversation.append('<li>(<small>' + time + '</small>) <strong>' + nick + ' &mdash; </strong>' + msg + '</li>');
	
	this.conversation.scrollTop(999999); // Hack: autoscroll down to last message
}

// Escape to avoid injections

var escape = function(html) {
	return String(html)
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}