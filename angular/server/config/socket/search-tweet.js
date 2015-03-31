var searchTweet = module.exports = {};
var Twitter = require('twitter');
var twitter = new Twitter(require('./twitter-auth'));

searchTweet.countWords = function(keywords, socket) {
	console.log(keywords);
	twitter.stream('statuses/filter',{track: keywords, language: 'en'}, function(stream) {
		console.log(stream);
		stream.on('data', function(data) {
			console.log(data);
			if (data && data.text) {
				var words = data.text.split(/\s+/);
				if (!socket.continueStreaming || !socket.connected) {
					console.log('destroying streamin..');
					stream.destroy();
					socket.continueStreaming = false;
				}
				else {
					socket.emit('searchTweetCountResults', words);
				}
			}
		});
		stream.on('error', function(error) {
			throw error;
		});
		console.log('oiy');
	});
};