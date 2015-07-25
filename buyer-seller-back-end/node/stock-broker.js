var stockBroker = module.exports = {};

stockBroker.buyStocks = function(companyData, metadata) {
	var stockCost = companyData.quote.price;
	if (!stockCost) {
		return;
	}
	var maxMoneyToSpend = Math.min(metadata.money, 200.00);
	var cost = 0;
	var stocksToPurchase = 0;
	while (cost < maxMoneyToSpend) {
		cost += stockCost
		stocksToPurchase++;
	}
	metadata.stocksOwned[companyData.ticker] += stocksToPurchase;
	metadata.money -= cost;
};

stockBroker.sellStocks = function(companyData, metadata) {
	var stockCost = companyData.quote.price;
	if (!stockCost) {
		return;
	}
	var stocksOwned = metadata.stocksOwned[companyData.ticker];
	var moneyEarned = stockCost * stocksOwned;
	metadata.money += cost;
	metadata.stocksOwned[companyData.ticker] = 0;
};