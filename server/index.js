/**
 * Main application file
 */

'use strict';
// node 7 doesn't support es6 import yet!

const http = require('http');
const express = require('express');
const config = require('./config/environment');
const errorHandler = require('errorhandler');

// import mongoose from 'mongoose';
// mongoose.Promise = require('bluebird');
// import http from 'http';
// import seedDatabaseIfNeeded from './config/seed';

// Connect to MongoDB
// mongoose.connect(config.mongo.uri, config.mongo.options);
// mongoose.connection.on('error', function(err) {
//   console.error(`MongoDB connection error: ${err}`);
//   process.exit(-1); // eslint-disable-line no-process-exit
// });

// Setup server
const app = express();
const server = http.createServer(app);

if ('development' === app.settings.env) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
else if ('production' === app.settings.env) {
  app.use(errorHandler());
}

app.set('views', __dirname + '/views');

/* Socket.io Communication */
const io = require('socket.io')(server);
// io.on('connection', (socket) => {
//   require('./api/socket.js')(socket, io, persistent_data)
// });

// the order of the next two lines is important (try to serve static files before redirecting)
app.use(express.static(__dirname + '/views'));
app.get('*', (req,res) => {
  res.sendFile(__dirname + '/views/index.html')
})



// Start server:
server.listen(config.port, () => {
  console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
})
