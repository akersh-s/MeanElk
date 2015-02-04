/* global io */
'use strict';

angular.module('angularApp')
  .factory('socket', function(socketFactory) {
    var ioSocket = io('', {
      path: '/socket.io-client'
    });
    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return socket;
  });
