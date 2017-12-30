/* quidditch.js - Start a quidditch match between the houses
*/

var path = require('path');
var extend = require('extend');

var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to

var Team;
var delay;

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'quidditch',
	type: 'whisper',
	whitelist: true,
	event: 'quidditch:start'
}];

// Setup an overlay to display the quidditch match
var	overlay = {
	name: 'quidditch',									// The name of your overlay (for internal referral)
	type: 'html',
	layout: 'fullscreen',
  view: path.join(__dirname, 'views/quidditch.html'),  // The view you want to be rendered (required)
	static: path.join(__dirname) + '/static'						// Grab the directory to server static files from
};

var start = function start(_eventbus, _Team, options = {delay: 20000}) {
	eventbus = _eventbus;
	Team = _Team;

	delay = options.delay;

	// Add event listeners from Twitch chat
	eventbus.on('overlays:quidditch:end', winner);	// Celebrate the winner

	eventbus.emit('commands:add', commands);
	eventbus.emit('overlays:add', overlay);
};

var winner = function winner(house) {
	// Declare the winner and give them some damn gold
	var response = [];
	var value = 5;

	// Pay winners
	Team.add(house, value, function(err, data) {
		if(!err && data) {
			// Show overlay
			var houseShort = house.substr(0, 1).toLowerCase();
			var event = 'overlay:q' + houseShort + 'w' + ':show';
			eventbus.emit(event);

			// Tell chat
			setTimeout(function() {
				response.push(strings.cup.added + 5 + strings.cup.points_to + house);
				eventbus.emit('twitch:say', response);
			}, delay);	// 10 second pause to account for twitch stream delay
		}
	});
}



module.exports = {
	start: start,
	overlay: overlay,
	commands: commands
};
