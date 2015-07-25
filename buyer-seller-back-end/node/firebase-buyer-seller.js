var firebaseBuyerSeller = module.exports = {};

var Firebase = require('firebase');

var firebaseRoot = new Firebase('https://buyer-seller.firebaseio.com/');
var firebaseSentimentData = firebaseRoot.child('sentimentData');
var companies = require('./resources/companies.json');
var firebaseSentimentStockScores = firebaseRoot.child('sentimentStockScores');

function addKeywordsToSentimentStockScore(companySentimentStockScores, company) {
	var changed = false;
	company.keywords.forEach(function(keyword) {
		var found = false;
		keyword = keyword.toLowerCase();
		for (var sentimentWord in companySentimentStockScores) {
			if (sentimentWord === keyword) {
				found = true;
			}
		}
		if (!found) {
			companySentimentStockScores[keyword] = 0;
			changed = true;
		}
	})
	return changed;
}
//Public Functions
firebaseBuyerSeller.firebaseQuotes = firebaseRoot.child('quotes');
firebaseBuyerSeller.firebaseRecentTweetSentiments = firebaseRoot.child('recentTweetSentiments');

firebaseBuyerSeller.saveData = function(data) {
    data.time = +new Date();
    firebaseSentimentData.set(data);
};

firebaseBuyerSeller.setSentimentStockScoreDefaults = function(cb) {
	firebaseSentimentStockScores.once('value', function(snap) {
		var currentSentimentStockScores = snap.val() || {};
	
		var changed = false;
		companies.forEach(function(company) {
			var companyCurrentSentimentStockScore = currentSentimentStockScores[company.ticker];
			if (!companyCurrentSentimentStockScore) {
				currentSentimentStockScores[company.ticker] = require('../node_modules/sentiment/build/AFINN.json');
				changed = true;
			}
			changed = addKeywordsToSentimentStockScore(currentSentimentStockScores[company.ticker], company) || changed;
		});
		if (changed) {
			firebaseSentimentStockScores.set(currentSentimentStockScores);
			firebaseBuyerSeller.sentimentStockScores = currentSentimentStockScores;
		}
		if (cb) cb();
	});
};