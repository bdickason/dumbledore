/* Test for config/tmi-options.js */

var assert = require('chai').assert;

// Needed for test
var fs = require('fs');	// Used to check if file exists

// Dependencies
require('dotenv').config();

describe('Twitch Username', function() {
	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_USERNAME);
	});
})

describe('Twitch Password', function() {
	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_PASSWORD);
	});

	it('begins with the string "oauth:"', function() {
		assert.equal('oauth:', process.env.HPC_PASSWORD.substring(0, 6));
	});
})

describe('Twitch Chat Channel', function() {
	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_CHANNEL);
	});

	it('begins with a # sign', function() {
		assert.equal('#', process.env.HPC_CHANNEL.substring(0, 1));
	});
})
