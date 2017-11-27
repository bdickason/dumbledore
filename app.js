var fs = require('fs');
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
  whitelist: require('./config/whitelist.json'),
  eventbus: events
};

// Initialize bot
var bot = new hpcbot(options);

/* Setup overlays */
var overlays = require('./overlays');
bot.overlays.add(overlays);

/* Setup commands */
// !rules - Shows the rules of the HPC
var rules = require('./lib/rules');
rules.start(options.eventbus);
bot.commands.add(rules.commands);

// Message on Join
var Join = require('./lib/join');
Join.start(options.eventbus, bot.User);

// Goblin Gold
var Gold = require('./lib/gold');
Gold.start(options.eventbus, bot.Resource, bot.Channel);

// butterbeer
var Beer = require('./lib/beer');
Beer.start(options.eventbus, bot.Resource, bot.Channel, bot.User);
bot.commands.add(Beer.commands);
bot.overlays.add(Beer.overlay);

// !setcommends / !commends
var Commends = require('./lib/commends');
Commends.start(options.eventbus, bot.User);
bot.commands.add(Commends.commands);

// !house / !sortinghat
var House = require('./lib/house');
House.start(options.eventbus, bot.User);
bot.overlays.add(House.overlay);
bot.commands.add(House.commands);

// !status
var Status = require('./lib/status');
Status.start(options.eventbus, bot.User);
bot.commands.add(Status.commands);

// !dice / !coin
var Random = require('./lib/random');
Random.start(options.eventbus);
bot.commands.add(Random.commands);

// !cup
var Housecup = require('./lib/housecup');
Housecup.start(options.eventbus, bot.Team);
bot.commands.add(Housecup.commands);

// !hween
var Halloween = require('./lib/halloween');
Halloween.start(options.eventbus, bot.Team);
// commands.push(Halloween);

// Subscribers
var Subscribe = require('./lib/subscribe');
Subscribe.start(options.eventbus);

// Quidditch
var Quidditch = require('./lib/quidditch');
Quidditch.start(options.eventbus, bot.Team);
bot.overlays.add(Quidditch.overlay);

// !text (External module)
var Text = require('./lib/text');
Text.start(options.eventbus);


// Quickly load all commands?
// fs.readdir('./lib', function(err, directories) {
//   if(err) {
//     console.error('There was an issue reading the commands directory', err);
//   }
//   directories.forEach(function(directory) {
//     // 1. Require the module
//     var tmp = require('./lib/' + directory);
//     // Register chat listeners
//     bot.commands.add(tmp.commands);
//   });
// });
