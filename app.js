require('dotenv').config();	// Load environment variables from .env

var hpcbot = require('../hpc-bot');

// Shared eventbus for passing around events
var EventEmitter = require('events');
var events = new EventEmitter();

// Initialize bot config
var options = {
  username: process.env.HPC_USERNAME,
  oauth: process.env.HPC_PASSWORD,
  channel: process.env.HPC_CHANNEL,
  clientID: process.env.HPC_CLIENTID,
  mixpanel: process.env.HPC_MIXPANEL,
  eventbus: events
};

// Initialize bot
var bot = new hpcbot(options);

// Load the modules you want to use
// bot.use(hpcbot.chat); // Should this be always on?

// Initialize overlays
//

var overlays = [
  {
    name: 'hpcwins',
    type: 'video',
    file: 'overlays/events/hpcwins.mp4'
  },
  {
    name: 'powermove',
    type: 'video',
    file: 'overlays/events/powermove.mp4'
  }];

bot.overlays.add(overlays);
// bot.overlays.add(overlays.powermove);

// hpcbot.overlays.add(overlays);

// bot.use(hpcbot.webui);
// bot.use(hpcbot.db);
// bot.use(hpcbot.resource);

/*


// Initialize overlays module
bot.use(hpcbot.overlays({ port: 3000});

// hpcbot.overlays.add(overlays);
*/
