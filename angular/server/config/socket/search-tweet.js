var searchTweet = module.exports = {};
var Twitter = require('twitter');
var twitter = new Twitter(require('./twitter-auth'));
var first = true;
searchTweet.countWords = function(keywords, socket) {
	console.log(keywords);
	twitter.stream('filter',{track: keywords, language: 'en'}, function(stream) {
		stream.on('data', function(data) {
			if (!socket.continueStreaming || !socket.connected) {
				console.log('destroying streamin..');
				stream.destroy();
				socket.continueStreaming = false;
			}
			else if (data && data.geo && data.geo.coordinates) {
				socket.emit('tweetInfo', data.geo.coordinates);
			}
		});
		stream.on('error', function(error) {
			console.error(error);
			throw error;
		});
	});
};