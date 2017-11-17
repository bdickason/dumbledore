require('dotenv').config();	// Load environment variables from .env

var hpcbot = require('../hpc-bot');

// Initialize bot config
var options = {
  username: process.env.HPC_USERNAME,
  oauth: process.env.HPC_PASSWORD,
  channel: process.env.HPC_CHANNEL,
  clientID: process.env.HPC_CLIENTID,
  mixpanel: process.env.HPC_MIXPANEL
};

hpcbot(options);
