/* text.js - !Command to have the bot display and read text
*/

var eventbus;	// Global event bus that modules can pub/sub to

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'text',
	type: 'whisper',
	whitelist: true,
	event: 'text:show'
}];

var overlay = {
	name: 'text',
	type: 'text'
};

var start = function start(_eventbus) {
	eventbus = _eventbus;
	eventbus.on(commands[0].event, text);
	eventbus.emit('commands:add', commands);
};

var text = function text(username, text) {
	var response = [];

	// What should we show on stream?
	var payload = assemblePayload(username, text);

	eventbus.emit('overlay:text:show', payload);
};

var assemblePayload = function(username, text) {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};

	if(text.length > 200) {
		// You know some jerk is gonna throw a long novel in
		text = text.substring(200);
	}

	payload.username = username;
	payload.text = text;

	return(payload);
}

module.exports = {
	start: start,
	commands: commands
};
