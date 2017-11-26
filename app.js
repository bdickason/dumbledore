require('dotenv').config();	// Load environment variables from .env

// var hpcbot = require('../hpc-bot');  // For testing
var hpcbot = require('hpc-bot');

// Shared eventbus for passing around events
var EventEmitter = require('events');
var events = new EventEmitter();

// Initialize bot config
var options = {
  username: process.env.HPC_USERNAME,
  oauth: process.env.HPC_PASSWORD,
  channel: process.env.HPC_CHANNEL,
  clientID: process.env.HPC_CLIENTID,
  mixpanel: process.env.MIXPANEL,
  eventbus: events
};

// Initialize bot
var bot = new hpcbot(options);

// Setup chat listeners

// Setup overlays
var overlays = require('./overlays');
bot.overlays.add(overlays);
