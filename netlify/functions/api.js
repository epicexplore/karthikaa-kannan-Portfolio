const serverless = require('serverless-http');
const app = require('../../server'); // Import the Express App

module.exports.handler = serverless(app);
