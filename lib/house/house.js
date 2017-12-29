/* house.js - !Command to set and get a user's house
*/

var path = require('path');
var strings = require('../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'house',
	type: 'chat',
	event: 'house:get'
}, {
	name: 'sortinghat',
	type: 'chat',
	event: 'house:set'
}, {
	name: 'housetest',
	type: 'whisper',
	whitelist: true,
	event: 'house:test'
}];

// Setup an overlay to display a house when someone gets sorted
var	overlay = {
	name: 'house',									// The name of your overlay (for internal referral)
	type: 'audio',
	directory: 'lib/house/static'
};

var start = function start(_eventbus, _User) {
	eventbus = _eventbus;
	User = _User;

	// Add event listeners from Twitch chat
	eventbus.on(commands[0].event, getHouse);
	eventbus.on(commands[1].event, setHouse);	// Apply to the Sorting Hat!
	eventbus.on(commands[2].event, testHouse); // Test the sorting hat overlay

	eventbus.emit('commands:add', commands);
	eventbus.emit('overlays:add', overlay);
};

var getHouse = function getHouse(username, parameters) {
	// Tells chat what house a user belongs to
	var target;

	if(parameters) {
		// User is looking for someone else's house
		target = parameters.toLowerCase();	// Convert to lowercase as all twitch usernames are passed in lowercase
	}
	else {
		// User is looking for their own house
		target = username;
	}

	var response = [];

	User.getHouse(target, function(err, house) {
		if(!err) {
			if(house == null) {
				// User not found
				response.push(strings.house.cannot_find + target);
			}
			else {
				// Check if user is a muggle (unsorted) or member of a house
				if(house == 'muggle')
				{
					response.push(target + strings.house.muggle);
					eventbus.emit('overlay:muggle:show');
				}
				else {
					response.push(target + strings.house.proud_member_of + house);
				}
			}
			eventbus.emit('twitch:say', response);
		}
	});
};

var setHouse = function setHouse(username, parameters) {
	// Sort a user into a specific house. This is binding and cannot be changed. All users are muggles until they've been sorted.
	// input: bdickason
	// output: hufflepuff

	var response = [];

	var error = null;	// In case we need to throw our own error
	var house = null;

	// Check if user exists
	User.exists(username, function(err, exists) {
		if(!exists) {
			// User doesn't exist - we need to add them first
			User.create(username, function(err, user) {
				User.setHouse(username, function (err, house) {
					if(!err) {
						// What should the bot say?
						response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
						eventbus.emit('twitch:say', response);

						// What should we show on stream?
						var payload = assemblePayload(username, house);
						eventbus.emit('overlay:house:show', payload);
					}
				});
			});
		}
		else {
			User.getHouse(username, function(err, house) {
				// Make sure a user isn't already sorted (check their house)
				if(house == 'muggle') {
					// User hasn't been sorted, sort away!
					User.setHouse(username, function (err, house) {
						if(!err) {
							// What should the bot say?
							response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
							eventbus.emit('twitch:say', response);

							// What should we show on stream?
							var payload = assemblePayload(username, house);
							eventbus.emit('overlay:house:show', payload);

						}
					});
				}
				else {
					response.push(strings.sorting.user_already_sorted);
					eventbus.emit('twitch:say', response);
				}
			});
		}
	});
};

var testHouse = function testHouse(username, parameters) {
	// Test the sortinghat overlay via whisper command
	// input: bdickason
	// output: hufflepuff

	var response = [];

	var error = null;	// In case we need to throw our own error
	var house = null;

	house = User.generateHouse();

	// What should the bot say?
	response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
	eventbus.emit('twitch:whisper', username, response);

	// What should we show on stream?
 	var payload = assemblePayload('Mike Heeto', house);
	eventbus.emit('overlay:house:show', payload);
};

var assemblePayload = function(username, house) {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};
	payload.text = strings.sorting.congrats + username + strings.sorting.joined_house;

	payload.username = username;

	switch(house) {
		case 'Hufflepuff':
					payload.text += 'Hufflepuff',
			  	payload.image = overlay.name + '/images/hufflepuff.png',
			  	payload.audio = overlay.name + '/audio/hufflepuff.m4a'
			break;
			case 'Gryffindor':
					payload.text += 'Gryffindor',
			  	payload.image = overlay.name + '/images/gryffindor.png',
			  	payload.audio = overlay.name + '/audio/gryffindor.m4a'
			break;
			case 'Ravenclaw':
				payload.text += 'Ravenclaw',
			  	payload.image = overlay.name + '/images/ravenclaw.png',
			  	payload.audio = overlay.name + '/audio/ravenclaw.m4a'
			break;
			case 'Slytherin':
					payload.text += 'Slytherin',
			  	payload.image = overlay.name + '/images/slytherin.png',
			  	payload.audio = overlay.name + '/audio/slytherin.m4a'
			break;
	}
	return(payload);
}


module.exports = {
	start: start,
	overlay: overlay,
	commands: commands
};
