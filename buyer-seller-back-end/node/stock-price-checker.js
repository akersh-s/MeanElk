var stockPriceChecker = module.exports = {};
var http = require('http');
var sectors = require('./resources/sectors.json');
var _ = require('lodash');

//Private Functions
var createMeaningfulQuotePropertyNames = function(data) {
	var quotes = [];
	data.forEach(function(googleQuote) {
		var quote = {};
		quote.ticker = googleQuote.t;
		quote.exchange = googleQuote.e;
		if (googleQuote.l_cur && !isNaN(parseFloat(googleQuote.l_cur))) {
			quote.price = parseFloat(googleQuote.l_cur);	
		}
		else if (googleQuote.l_fix && !isNaN(parseFloat(googleQuote.l_fix))) {
			quote.price = parseFloat(googleQuote.l_fix);	
		}
		else {
			quote.price = 0;
		}
		quote.change = googleQuote.c;
		quote.changePercent = googleQuote.cp;
		quote.lastTradeTime = googleQuote.lt;
		if (googleQuote.div) quote.dividend = googleQuote.div;
		if (googleQuote.yld) quote.yield = googleQuote.yld;
		quotes.push(quote);
	});
	return quotes;
};

//Public Functions
stockPriceChecker.downloadAllSectorPrices = function(cb) {
	var allTickerSymbols = _.pluck(sectors, 'symbols');
	stockPriceChecker.downloadPrices(allTickerSymbols, cb);
};

stockPriceChecker.downloadPrices = function(tickerSymbols, cb) {
	var q = tickerSymbols.join(',');
	http.get('http://www.google.com/finance/info?q=' + q, function(res) {
		var chunks = [];
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			if (chunk) {
				chunks.push(chunk);	
			}
		});
		res.on('end', function() {
			var data = [];
			if (chunks.length > 0) {
				data = chunks.join();
				//data = data.replace('//', '').trim();
				data = data.substring(3).replace(/[\n\r]/, '').trim();
				try {
					data = JSON.parse(data);
				}
				catch (e) {
					console.log('data', data);
					console.log(e);
					data = [];
				} 
				data = createMeaningfulQuotePropertyNames(data);
			}
			return cb(data);
		});
	}).on('error', function(err) {
		console.log('Got error downloading prices: ' + err);
	});
};

stockPriceChecker.downloadAllSectorPrices(function(data) {
	console.log(data);
})