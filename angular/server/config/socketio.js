/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var searchTweet = require('./socket/search-tweet');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });
  socket.connected = true;
  socket.continueStreaming = false;
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    socket.on('searchTweetCount', function(keywords) {
      socket.continueStreaming = true;
      searchTweet.countWords(keywords, socket);
    });

    socket.on('stop', function() {
      socket.continueStreaming = false;
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};

//Error handler
process.on('uncaughtException', function (exception) {
  // handle or ignore error
  console.log('Error!!');
  console.log(exception);
});