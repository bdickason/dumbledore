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
  youtubeKey: process.env.YOUTUBEKEY,
  hostname: process.env.HOSTNAME,
  twitchClientID: process.env.TWITCHCLIENTID,
  twitchSecret: process.env.TWITCHSECRET,
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

// Message on Join
var Join = require('./lib/join');
Join.start(options.eventbus, bot.User);

// Goblin Gold
var Gold = require('./lib/gold');
Gold.start(options.eventbus, bot.Resource, bot.Channel);

// butterbeer
var Beer = require('./lib/beer');
Beer.start(options.eventbus, bot.Resource, bot.Channel, bot.User);
// bot.overlays.add(Beer.overlay);  // Add overlays once we have them

// !setcommends / !commends
var Commends = require('./lib/commends');
Commends.start(options.eventbus, bot.User);

// !house / !sortinghat
var House = require('./lib/house');
House.start(options.eventbus, bot.User);
bot.overlays.add(House.overlay);

// !status
var Status = require('./lib/status');
Status.start(options.eventbus, bot.User);


// !dice / !coin
var Random = require('./lib/random');
Random.start(options.eventbus);

// !cup
var Housecup = require('./lib/housecup');
Housecup.start(options.eventbus, bot.Team);


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

/* Seasonal Commands */

// Halloween Event
var Halloween = require('./lib/halloween');
Halloween.start(options.eventbus, bot.Team);

// Xmas Event
var Xmas = require('./lib/xmas');
Xmas.start(options.eventbus, bot.Team, bot.User, bot.random, 30000, 32000);

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
