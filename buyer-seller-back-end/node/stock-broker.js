var stockBroker = module.exports = {};

stockBroker.buyStocks = function(quotes, cb) {
	var cost = 0;
	var stocksPurchased = 0;
	quotes.forEach(function(quote) {
		cost += quote.price;
		stocksPurchased++;
	});
	return cb(cost, stocksPurchased);
};

stockBroker.sellStocks = function(quotes, cb) {
	var cost = 0;
	var stocksSold = 0;
	quotes.forEach(function(quote) {
		cost += quote.price;
		stocksSold++;
	});
	return cb(cost, stocksSold);
};