/* beer.js - Spend your hard earned goblin gold on a round of butter beer!
Usage:
* !beer - Buys a round of butter beer for the channel
* !beer Larry_Manalo - Buys a round of butterbeer for Larry_Manalo
*/

var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Resource;
var Channel;
var User;

var cost;

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'beer',
	type: 'chat',
	whitelist: false,
	event: 'command:beer'
}];

// Configure overlays so the overlay server can display them
var overlays = [{
	name: 'beer_single',
	type: 'video',
	volume: 0.5,
	file: 'lib/beer/overlay/beer_single.mp4'
}, {
	name: 'beer_channel',
	type: 'video',
	volume: 0.5,
	file: 'lib/beer/overlay/beer_channel.mp4'
}];

var start = function start(_eventbus, _Resource, _Channel, _User) {
	eventbus = _eventbus;
	Resource = _Resource;
	Channel = _Channel;
	User = _User;

	cost_single = 1;					// How much gold should we charge?
	cost_channel = 2;
	// limit = 30;					// How often (seconds) can someone buy butter beer?

	eventbus.on(commands[0].event, beer);
	eventbus.emit('commands:add', commands);
	eventbus.emit('overlays:add', overlays);
};

var beer = function beer(username, parameters) {

	// Chat trigger to buy butter beer
	var response = [];

	// Only allow beer purchases when the stream is live
	// if(Channel.isLive()) {
		// Check if the user has enough gold
			Resource.get(username, function(err, amount) {
					// Figure out if this is for the channel or a specific user
					if(parameters) {
						User.exists(parameters.toLowerCase(), function(err, success) {
							if(success) {
								if(amount >= cost_single) {
									// Buy some beer for someone!!
									Resource.take(username, cost_single, function(err, result) {
										if(!err) {
											response.push(username + strings.beer.bought_person + parameters);
											eventbus.emit('twitch:say', response);
											eventbus.emit('overlay:beer_single:show', username + ' bought a butterbeer for ' + parameters);
										}
									});
								} else {
										// User doesn't have enough gold :\
										response.push(strings.beer.sorry + username + strings.beer.not_enough_gold);
										eventbus.emit('twitch:say', response);
								}
							} else {
								// User does not exist
								response.push(strings.beer.cant_find + parameters);
								eventbus.emit('twitch:say', response);
							}
						});
					} else {
						// Beer is for the channel!
						if(amount >= cost_channel) {
							Resource.take(username, cost_channel, function(err, result) {
								response.push(strings.beer.wow + username + strings.beer.bought_channel);
								eventbus.emit('twitch:say', response);
								eventbus.emit('overlay:beer_channel:show', username + ' bought a round of butterbeers for the channel!');
							});
						} else {
						// User doesn't have enough gold :\
						response.push(strings.beer.sorry + username + strings.beer.not_enough_gold);
						eventbus.emit('twitch:say', response);
						}
					}
			});
	// }
};

module.exports = {
	start: start,
	commands: commands
};
