/* xmas.js - !Commands to start the Xmas Event
*/

var Chance = require('chance');

var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Team;
var User;
var random;

var active;	// Is there a game active right now?
var delay1;
var delay2;

var house;					// House that's currently voting
var redVotes;				// Tally the red votes
var greenVotes;			// Tally the green votes
var voters;					// List of users who have voted
var value;					// # of points to distribute

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

var start = function start(_eventbus, _Team, _User, _random, _delay1, _delay2) {
	eventbus = _eventbus;
	Team = _Team;
	User = _User;
	random = _random;

	delay1 = _delay1;	// Delay before vote
	delay2 = _delay2;	// Delay before results

	// Add event listeners from Twitch chat
	eventbus.on(commands[0].event, xmas);

	value = 5;	// Amount of house cup points to give out

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
		'Slytherin'
	];

	var sock;
	var SOCKS = [
		'RED',
		'GREEN'
	];


	// Pick a random house (0-3)
	// var randomHouse = random.between(0, 3);	// For testing
	var randomHouse = 3;

	house = HOUSES[randomHouse];

	// Pick a random sock (0-1)
	var randomSock = random.between(0, 1);
	sock = SOCKS[randomSock];

	// Play 'house selection' overlay for that house
	eventbus.emit('overlay:Xmas' + house[0] + ':show');

	// Set timer for start of house selection video
	setTimeout(function() {
		// Add listener for '!1', '!2'
		eventbus.emit('twitch:say', ['Voting has opened for House: ' + house]	);
		eventbus.on('vote:1', incrementRed);
		eventbus.on('vote:2', incrementGreen);

		var winner;
		// Set timer for ~34s
		setTimeout(function() {
			// Check if winning votes are red or green

			if(redVotes == greenVotes) {
				// It's a tie! Flip a coin :)
				eventbus.emit('twitch:say', ["Red: " + redVotes + " Green: " + greenVotes + " It's a draw... sad."]);

				var dVote = SOCKS[random.between(0, 1)];
				if(dVote == 'RED') {
					redVotes++;
				} else {
					dVote = 'MrDestructoid'
					greenVotes++;
				}
				eventbus.emit('twitch:say', ["Since you can't decide on your own... I'll cast my vote for the " + dVote + ' stocking.']);
			}
			if(redVotes > greenVotes) {
				eventbus.emit('twitch:say', ["Red: " + redVotes + " Green: " + greenVotes + " You voted Red."]);
				if(sock == 'RED') {
					winner = true;
					eventbus.emit('overlay:xrw:show');
				} else {
					winner = false;
					eventbus.emit('overlay:xrl:show');
				}
			} else if(greenVotes > redVotes) {
				eventbus.emit('twitch:say', ["Red: " + redVotes + " Green: " + greenVotes + " You voted Green."]);
				if(sock == 'GREEN') {
					winner = true;
					eventbus.emit('overlay:xgw:show');
				} else {
					winner = false;
					eventbus.emit('overlay:xgl:show');
				}
			}
			else if(redVotes == greenVotes) {

			}

			if(winner) {
				Team.add(house, value, function(err, data) {
	        if(!err && data) {
						setTimeout(function() {
							eventbus.emit('twitch:say', ['Congratulations! You guessed right and earned ' + value + ' points for youre house!']);
							eventbus.emit('gold:overlay');
						}, 20000);
					}
				});
			} else {
				Team.remove(house, value, function(err, data) {
	        if(!err && data) {
						setTimeout(function() {
							eventbus.emit('twitch:say', ['Darn! You you guessed wrong and lost ' + value + ' points for youre house!']);
							eventbus.emit('gold:overlay');
						}, 20000);
					}
				});
			}

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
				eventbus.emit('twitch:say', [username + ' voted for the Red stocking!']);
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
				eventbus.emit('twitch:say', [username + ' voted for the Green stocking!']);
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
	house = null;
	sock = null;
}

module.exports = {
  start: start,
  xmas: xmas,
  commands: commands
};
