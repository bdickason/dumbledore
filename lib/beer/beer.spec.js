/* Test for beer.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

describe('Butter Beer', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out models
		var Resource = {
			get: function() {},
			take: function() {}
		};
		getStub = this.sinon.stub(Resource, 'get');
		takeStub = this.sinon.stub(Resource, 'take');

		var Channel = {
			isLive: function() {}
		};
		liveStub = this.sinon.stub(Channel, 'isLive');

		var User = {
			exists: function() {}
		}
		existsStub = this.sinon.stub(User, 'exists');

		Beer = require('.');
		Beer.start(eventbus, Resource, Channel, User);
	});
	describe('!beer', function() {
		describe('Buy for room', function() {
			it('Enough Cash: Buys a round for the room', function(done) {
				var username = 'bdickason';
				var parameters = null;

				var _response = [];

				liveStub.returns(true);
				getStub.yields(null, 220);
				takeStub.yields(null, 20);

				eventbus.once('twitch:say', function(response) {
					assert.equal(response.length, 1);
					assert.equal(response[0], strings.beer.wow + username + strings.beer.bought_channel);
					done();
				});

				eventbus.emit('command:beer', username, parameters);
			});
			it('Not enough cash: Error Message', function(done) {
				var username = 'bdickason';
				var parameters = null;

				var _response = [];

				liveStub.returns(true);
				getStub.yields(null, 50);

				eventbus.once('twitch:say', function(response) {
					assert.equal(response.length, 1);
					assert.equal(response[0], strings.beer.sorry + username + strings.beer.not_enough_gold);
					done();
				});

				eventbus.emit('command:beer', username, parameters);
			});
		});
		describe('Buy for single person', function() {
			it('Valid User: Buys them a beer!', function(done) {
				var username = 'bdickason';
				var parameters = 'larry_manalo';

				var _response = [];

				liveStub.returns(true);
				getStub.yields(null, 120);
				existsStub.yields(null, true);
				takeStub.yields(null, 20);

				eventbus.once('twitch:say', function(response) {
					assert.equal(response.length, 1);
					assert.equal(response[0], username + strings.beer.bought_person + parameters);
					done();
				});

				eventbus.emit('command:beer', username, parameters);
			});
			it('Invalid User: Errors out', function(done) {
				var username = 'bdickason';
				var parameters = 'larry_manalo';

				var _response = [];

				liveStub.returns(true);
				getStub.yields(null, 120);
				existsStub.yields(null, false);

				eventbus.once('twitch:say', function(response) {
					assert.equal(response.length, 1);
					assert.equal(response[0], strings.beer.cant_find + parameters);
					done();
				});

				eventbus.emit('command:beer', username, parameters);
			});
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
