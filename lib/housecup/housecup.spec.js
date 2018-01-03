/* Test for commends.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Housecup;

describe('House Cup', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out Team
		Team = {
			getAll: () => {},
			add: () => {},
			remove: () => {},
			reset: () => {}
		};

		getAllStub = this.sinon.stub(Team, 'getAll');
		addStub = this.sinon.stub(Team, 'add');
		removeStub = this.sinon.stub(Team, 'remove');
		resetStub = this.sinon.stub(Team, 'reset');

		// Stub out User
		User = {
			getHouseMembers: () => {}
		}

		getHouseMembersStub = this.sinon.stub(User, 'getHouseMembers');

		// Stub out Resource
		Resource = {
			giveMany: () => {}
		}

		giveManyStub = this.sinon.stub(Resource, 'giveMany')

		Housecup = require('.');
		Housecup.start(eventbus, Team, User, Resource);
	});
	describe('!cup', function() {
		it('There are standings: Returns the house standings in order', function(done) {
			var _response = [];
			_response.push('House Cup Standings:');
			_response.push('1. Slytherin: 15');
			_response.push('2. Ravenclaw: 10');
			_response.push('3. Hufflepuff: 7');
			_response.push('4. Gryffindor: 5');

			var data = {
				'Gryffindor': '5',
				'Hufflepuff': '7',
				'Slytherin': '15',
				'Ravenclaw': '10'
			};

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 5);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(response[1], _response[1]);
				assert.equal(response[2], _response[2]);
				assert.equal(response[3], _response[3]);
				assert.equal(response[4], _response[4]);

				done();
			});

			eventbus.emit('cup:show');
		});
		it('No standings: Says that the house cup hasn\'t started yet', function(done) {
			var _response = [];
			_response.push('It looks like the house cup hasn\'t started yet.');

			var data = {};

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);

				done();
			});

			eventbus.emit('cup:show');
		});
	});
	describe('!add', function() {
		it('Proper input: Adds 5 points to a house', function(done) {
			var input = 's 5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Added 5 points to Slytherin');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Proper input: Adds 10 points to a house', function(done) {
			var input = 'r 10';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Added 10 points to Ravenclaw');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No Parameters', function(done) {
			var input = null;

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No House', function(done) {
			var input = '5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Please enter the first letter of a house (g/h/r/s).');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No Number', function(done) {
			var input = 'h';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: Number besides 5 or 10', function(done) {
			var input = 'h 3';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'You can only award 5 or 10 points at a time.');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
	});
	describe('!sub', function() {
		it('Proper input: Subtracts 5 points from a house', function(done) {
			var input = 's 5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			removeStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.deepEqual(response[0], 'Subtracted 5 points from Slytherin. How imbarassing!');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
		it('Proper input: Subtracts 10 points from a house', function(done) {
			var input = 'g 10';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			removeStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.deepEqual(response[0], 'Subtracted 10 points from Gryffindor. How imbarassing!');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
		it('Bad input: No Parameters', function(done) {
			var input = null;

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
		it('Bad input: No House', function(done) {
			var input = '5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Please enter the first letter of a house (g/h/r/s).');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
		it('Bad input: No Number', function(done) {
			var input = 'h';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
		it('Bad input: Number besides 5 or 10', function(done) {
			var input = 'h 3';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'You can only award 5 or 10 points at a time.');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:remove', 'hpc.dobby', input);
		});
	});
	describe('!reset-cup', function() {
		it('Resets the cup standings', function(done) {
			var _response = [];
			_response.push('The house cup has been reset. May the odds be forever in your favor');
			var _username = 'hpc.dobby';

			var data = true;

			// Setup stub for our User dependency
			resetStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:reset', 'hpc.dobby');
		});
	});
	describe('!winner', function() {
		it('Valid Input: Gives points to the winning house', function(done) {
			let users = ['bdickason', 'mkulikow', 'larry_manalo']

			// Chat object
			let username = 'hpc.dobby'
			let house = 'g'
			let amount = 100
			let count = 3

			let _count = 3
			let _house = 'Gryffindor'
			let _amount = 100

			var _response = [];
			_response.push(`Wow! ${count} wizards of House ${_house} earned themselves ${_amount} points! Congorats!`);
			let _username = 'hpc.dobby'

			// Setup stub for our Team dependency
			getHouseMembersStub.yields(null, users);

			// Setup stub for our Resource dependency
			giveManyStub.yields(null, count);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				done();
			});

			eventbus.emit('cup:winner', 'hpc.dobby', `${house} ${amount}`);
		});
		it('No House: Returns an error', function(done) {
			let users = ['bdickason', 'mkulikow', 'larry_manalo']

			// Chat object
			let username = 'hpc.dobby'
			let house = null
			let amount = 5

			var _response = [];
			_response.push('Please specify the house to award goblin gold to.')
			let _username = 'hpc.dobby'

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:winner', 'hpc.dobby', `${house} ${amount}`);
		});
		it('No Points: Returns an error', function(done) {
			let users = ['bdickason', 'mkulikow', 'larry_manalo']

			// Chat object
			let username = 'hpc.dobby'
			let house = 'h'
			let amount = null

			var _response = [];
			_response.push('Please specify the amount of goblin gold to reward.')
			let _username = 'hpc.dobby'

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:winner', 'hpc.dobby', `${house} ${amount}`);
		});

	});
	describe('parseHouse', function() {
		it('Valid input: Returns a full house name', function() {
			let input = 'h'

			let _house = 'Hufflepuff'

			let house = Housecup.parseHouse(input)

			assert.equal(_house, house)
		});
		it('Invalid input: Returns false', function() {
			let input = 'P'

			let _house = false

			let house = Housecup.parseHouse(input)

			assert.equal(_house, house)
		});
		it('No input: Returns false', function() {
			let input = null

			let _house = false

			let house = Housecup.parseHouse(input)

			assert.equal(_house, house)
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
