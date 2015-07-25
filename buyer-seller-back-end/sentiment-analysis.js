var Twitter = require('twitter');
var twitter = new Twitter(require('./node/resources/twitter-config.json'));
var stockPriceChecker = require('./node/stock-price-checker');
var mathematician = require('./node/mathematician');
var stockBroker = require('./node/stock-broker');
var firebaseBuyerSeller = require('./node/firebase-buyer-seller');
var statusAnalyzer = require('./node/status-analyzer');
var companies = require('./node/resources/companies.json');

//Configurable Values
var iterationLengthSeconds = 10; //Decide to buy/sell every this amount of seconds, prepare variables, and reset.
var previousIterationsToTrackAverage = 3; //Number of previous iterations to track the average for in standard deviation
var numStdDeviations = 1; //Number of standard deviations above or below to buy/sell.
var minimumRequiredAnalyzedTweets = 100 //Minimum number of analyzed tweets to decide buy/sell. Otherwise, tweets will carry over to next iteration.
var numCompanyVariations = 2; //Number of variations to create for each company to perform a variation for machine learning on.

//Sentiment data for each company shall be stored as a property in the object below
//i.e. d['GOOG'] = { iteractionStart, averageSentimentScore, totalSentimentNum};
var d = {};
var metadata = {
    money: 2000.00,
    stocksOwned: {}
};
companies.forEach(function(company) {
    d[company.ticker] = { //aka companyData
        averageSentimentScore: 0,
        totalSentimentNum: 0,
        previousIterations: [],
        quote: 0
    };
    metadata.stocksOwned[company.ticker] = 0;

});

var prepareNextIteration = function(companyData) {
        var previousIterations = companyData.previousIterations;
        previousIterations.push({
            quote: companyData.quote,
            sentiment: companyData.averageSentimentScore
        });
        if (previousIterations.length > previousIterationsToTrackAverage) {
            previousIterations.shift();
        }
        companyData.averageSentimentScore = 0;
        companyData.totalSentimentNum = 0;
        companyData.iterationStart = +new Date();
};


var completeIteration = function() {
    stockPriceChecker.downloadAllSectorPrices(function(quotes) {
        firebaseBuyerSeller.firebaseQuotes.set(quotes);
        var dChanged = false;
        for (company in d) {
            var companyData = d[company];
            companyData.quote = stockPriceChecker.findQuoteForCompany(company, quotes);
            console.log(company, companyData);
            if (companyData.totalSentimentNum >= minimumRequiredAnalyzedTweets && companyData.quote) {
                if (companyData.previousIterations.length === previousIterationsToTrackAverage) {
                    var previousSentiments = _.pluck(companyData.previousIterations, 'sentiments');
                    var avg = mathematician.calculateMeanVarianceAndDeviation(previousSentiments);
                    var buyAmount = avg.mean + (avg.deviation * numStdDeviations);
                    var sellAmount = avg.mean - (avg.deviation * numStdDeviations);
                    if (companyData.averageSentimentScore > buyAmount /* and have enough money*/) {
                        stockBroker.buyStocks(companyData, metadata, function(cost, stocksPurchased) {
                            metadata.money -= cost;
                            metadata.stocksOwned[company] += stocksPurchased;
                        });
                    }
                    else if (companyData.averageSentimentScore < sellAmount && metadata.stocksOwned[company] > 0) {
                        stockBroker.sellStocks(companyData, metadata);
                    }
                }
                prepareNextIteration(companyData);
                dChanged = true;
            }
        }
        if (dChanged) {
            firebaseBuyerSeller.saveData(d);
        }
    });
};

var start = function() {
    twitter.stream('statuses/sample', {language: 'en'}, function(stream) {
        stream.on('data', function(twitterData) {
            if(twitterData && twitterData.text) {
                statusAnalyzer.analyzeStatus(d, twitterData.text);
            }
        });
    });
    setInterval(completeIteration, iterationLengthSeconds * 1000);
};

firebaseBuyerSeller.setSentimentStockScoreDefaults(function() {
    start();
});
