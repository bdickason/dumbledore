/* random.js - !Command to generate a random number (roll the dice)
TODO - This should be a standard bot library
*/

var Chance = require('chance');

var eventbus;	// Global event bus that modules can pub/sub to

var strings = require('../../config/strings.json');

// Configure Chat commands so the bot listens for this command
var commands = [{
	name: 'coin',
	type: 'chat',
	event: 'random:coin'
},{
	name: 'dice',
	type: 'chat',
	event: 'random:dice'
}];

var chance;

var start = function start(_eventbus) {
	eventbus = _eventbus;
	eventbus.on(commands[0].event, Coin);
	eventbus.on(commands[1].event, Dice);

	eventbus.emit('commands:add', commands);

	chance = new Chance();	// Random number generator
};


var Dice = function Dice(username, parameters) {
	// Roll a dice in the channel
	// (empty): Roll a dice between 1-6 (six sided die)
	// 3: Roll a dice between 1-3 (n sided die)

	var response = [];
	var size;
	var result;

	if(parameters && parameters !== 0) {
		// Generate random number between 1 and the user's Input

		var number = parseInt(parameters);	// convert string to int
		if(isNaN(number) || number <= 0) {
			// Tell user that they have to input a number
			response.push(strings.dice.error + parameters);
		}
		else {
			size = number;
			result = chance.integer({min: 1, max: size});

			response.push(strings.dice.rolling + size + strings.dice.sides);
			response.push(strings.dice.result + result);
		}
	}
	else {
		size = 6;
		result = chance.integer({min: 1, max: size});

		response.push(strings.dice.rolling + size + strings.dice.sides);
		response.push(strings.dice.result + result);
	}

	eventbus.emit('twitch:say', response);
};

var Coin = function Coin(username, parameters) {
	// Flip a coin in the channel
	// (empty): Return a heads (0) or tails (1)

	var response = [];
	var result;

	result = chance.bool() ? strings.coin.heads : strings.coin.tails;

	response.push(strings.coin.flipping);
	response.push(strings.coin.result + result);

	eventbus.emit('twitch:say', response);
};



module.exports = {
	start: start,
	commands: commands
};
