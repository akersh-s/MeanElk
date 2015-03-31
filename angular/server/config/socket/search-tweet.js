var searchTweet = module.exports = {};
var Twitter = require('twitter');
var twitter = new Twitter(require('./twitter-auth'));

searchTweet.countWords = function(keywords, socket) {
	twitter.stream('filter',{track: keywords, language: 'en', locations: '-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
		stream.on('data', function(data) {
			if (data && data.geo && data.geo.coordinates) {
				socket.emit('tweetInfo', data.geo.coordinates);
			}
		});
		stream.on('error', function(error) {
			console.error(error);
			throw error;
		});
		socket.destroyStream = function() {
			stream.destroy();
		};
	});
};