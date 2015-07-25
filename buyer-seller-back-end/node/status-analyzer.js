var statusAnalyzer = module.exports = {};
var companies = require('./resources/companies.json');
var sentiment = require('sentiment');
var firebaseBuyerSeller = require('./firebase-buyer-seller');
require('./string-util');

//Public Functions
statusAnalyzer.analyzeStatus = function(d, text) {
	companies.forEach(function(company) {
		var sentimentScore = sentiment(d.text, firebaseBuyerSeller.sentimentStockScores[company]).comparative;
		if (text.containsAny(company.keywords)) {
			var companyData = d[company.ticker];
			companyData.averageSentimentScore = ((companyData.averageSentimentScore * companyData.totalSentimentNum) + sentimentScore) / (companyData.totalSentimentNum + 1);
			companyData.totalSentimentNum++;
		}
	});
};