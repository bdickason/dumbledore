/* xmas.js - !Commands to start the Xmas Event
*/

var Chance = require('chance');

var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Team;
var User;

var active;	// Is there a game active right now?
var delay1;
var delay2;

var house;					// House that's currently voting
var redVotes;				// Tally the red votes
var greenVotes;			// Tally the green votes
var voters;					// List of users who have voted

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'xmas',
	type: 'chat',	// For testing
	// type: 'whisper',
	// whitelist: true,
	event: 'xmas:start'
}, {
	name: '1',
	type: 'chat',
	event: 'vote:1'
}, {
	name: '2',
	type: 'chat',
	event: 'vote:2'
}];

var start = function start(_eventbus, _Team, _User, _delay1, _delay2) {
	eventbus = _eventbus;
	Team = _Team;
	User = _User;

	delay1 = _delay1;	// Delay before vote
	delay2 = _delay2;	// Delay before results

	// Add event listeners from Twitch chat
	eventbus.on(commands[0].event, xmas);

	chance = new Chance();	// Random number generator

	resetGame();	// Set game to empty state
};

var xmas = function xmas(username, parameters) {
	active = true;

	var response = [];


  var HOUSES = [
		'Gryffindor',
		'Hufflepuff',
		'Ravenclaw',
		'Syltherin'
	];

	var sock;
	var SOCKS = [
		'RED',
		'GREEN'
	];


	// Pick a random house (0-3)
	var randomHouse = chance.integer({min: 0, max: 3});
	house = HOUSES[randomHouse];
	console.log(house);

	// Pick a random sock (0-1)
	var randomSock = chance.integer({min: 0, max: 1})
	sock = SOCKS[randomSock];
	console.log(sock);

	// Play 'house selection' overlay for that house
	eventbus.emit('overlay:Xmas' + house[0] + ':show');
	console.log('overlay:Xmas' + house[0] + ':show');

	// Set timer for start of house selection video
	setTimeout(function() {
		console.log('got here');
		// Add listener for '!1', '!2'
		console.log(house);
		eventbus.emit('twitch:say', 'Voting has opened for House: ' + house);
		eventbus.on('vote:1', incrementRed);
		eventbus.on('vote:2', incrementGreen);

		// Set timer for ~34s
		setTimeout(function() {
			// Check if winning votes are red or green
			if(redVotes > greenVotes) {
				eventbus.emit('twitch:say', "Red: " + redVotes + " Green: " + greenVotes + " You voted Red.");
				if(sock = 'RED') {
					eventbus.emit('overlay:xrw');
				} else {
					eventbus.emit('overlay:xrl');
				}
			} else if(greenVotes > redVotes) {
				eventbus.emit('twitch:say', "Red: " + redVotes + " Green: " + greenVotes + " You voted Green.");
				if(sock = 'GREEN') {
					eventbus.emit('overlay:xgw');
				} else {
					eventbus.emit('overlay:xgl');
				}
			}
			else if(redVotes == greenVotes) {
				eventbus.emit('twitch:say', "Red: " + redVotes + " Green: " + greenVotes + " It's a draw... sad.")
			}


			// If match w/ random sock: Reward points, play win overlay, say to Chat
			// Else: Deduct points, play loss ovelray, say to Chat

			// Remove event listeners
			eventbus.removeListener('vote:1', incrementRed);
			eventbus.removeListener('vote:2', incrementGreen);

			// Deactivate the game
			resetGame();
		}, delay2);
	}, delay1);





}

var incrementRed = function(username, parameters) {
	// User voted for red

	// Make sure the user didn't vote twice
	if(active && !voters.includes(username)) {
		// Check user's house
		User.getHouse(username, function(err, _house) {
			if(_house == house) {
				redVotes++;
				eventbus.emit('twitch:say', username + ' voted for the Red sock!');
				voters.push(username);
			}
		});
	}
}

var incrementGreen = function(username, parameters) {
	// User voted for green

	// Make sure the user didn't vote twice
	if(active && !voters.includes(username)) {
		// Check user's house
		User.getHouse(username, function(err, _house) {
			if(_house == house) {
				greenVotes++;
				eventbus.emit('twitch:say', username + ' voted for the Green sock!');
				voters.push(username);
			}
		});
	}
}

var resetGame = function() {
	active = false;
	redVotes = 0;
	greenVotes = 0;
	voters = [];
}

module.exports = {
  start: start,
  xmas: xmas,
  commands: commands
};
