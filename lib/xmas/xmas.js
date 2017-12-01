/* xmas.js - !Commands to start the Xmas Event
*/

var Chance = require('chance');

var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Team;

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'xmas',
	type: 'chat',	// For testing
	// type: 'whisper',
	// whitelist: true,
	event: 'xmas:start'
}];

var start = function start(_eventbus, _Team) {
	eventbus = _eventbus;
	Team = _Team;

	// Add event listeners from Twitch chat
	eventbus.on(commands[0].event, xmas);

	chance = new Chance();	// Random number generator
};

var xmas = function xmas(username, parameters) {
	var response = [];

	var house;
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

	// Set timer for ~20s
	// Play 'house selection' overlay for that house

	// Set timer for ~34s
	// Play 'Voting opens' overlay
	// Add listener for '!1', '!2'
	// If !1 and from house, increment votes_red
	// If !2 and from house, increment votes_green
	// If no votes, ??

	// Check if winning votes are red or green
	// If match w/ random sock: Reward points, play win overlay, say to Chat
	// Else: Deduct points, play loss ovelray, say to Chat


}

module.exports = {
  start: start,
  xmas: xmas,
  commands: commands
};
