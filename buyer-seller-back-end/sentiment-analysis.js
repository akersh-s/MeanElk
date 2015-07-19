var Twitter = require('twitter');
var Firebase = require('firebase');
var twitter = new Twitter(require('./node/resources/twitter-config.json'));
var sentiment = require('sentiment');
var stockPriceChecker = require('./node/stock-price-checker');
var mathematician = require('./node/mathematician');
var stockBroker = require('./node/stock-broker');

//Configurable Values
var iterationLengthSeconds = 25; //Decide to buy/sell every this amount of seconds, prepare variables, and reset.
var previousIterationsToTrackAverage = 3; //Number of previous iterations to track the average for in standard deviation
var numStdDeviations = 1; //Number of standard deviations above or below to buy/sell.

var firebaseRoot = new Firebase('https://buyer-seller.firebaseio.com/');
var firebaseQuotes = firebaseRoot.child('quotes');
var firebaseRecentTweetSentiments = firebaseRoot.child('recentTweetSentiments');
var firebaseSentimentData = firebaseRoot.child('sentimentData');
var d = {
    iterationStart: +new Date(),
    averageSentimentScore: 0,
    totalSentimentNum: 0,
};
var recentTweetSentiments = [];

//State information
d.money = 2000.00;
d.stocksOwned = 0;

//Global Variables
var previousIterationQuotes = d.previousIterationQuotes = [];
var previousIterationSentiments = d.previousIterationSentiments = [];

var saveData = function() {
    d.time = +new Date();
    firebaseSentimentData.set(d);
}
var prepareNextIteration = function(quotes) {
    if (quotes) {
        previousIterationQuotes.push(quotes);
        previousIterationSentiments.push(d.averageSentimentScore);
        if (previousIterationQuotes.length > previousIterationsToTrackAverage) {
            previousIterationQuotes.shift();
            previousIterationSentiments.shift();
        }
        d.averageSentimentScore = 0;
        d.totalSentimentNum = 0;
        d.iterationStart = +new Date();
        saveData();
    }
};

var updateRecentTweetSentiments = function(tweet, sentiment) {
    recentTweetSentiments.unshift({tweet: tweet, sentiment:sentiment});
    if (recentTweetSentiments.length > 100) {
        recentTweetSentiments.pop();
    }
    firebaseRecentTweetSentiments.set(recentTweetSentiments);
};

twitter.stream('statuses/sample', {language: 'en'}, function(stream) {
    stream.on('data', function(data) {
        if(data && data.text) {

            var sentimentScore = sentiment(data.text).comparative;
            d.averageSentimentScore = ((d.averageSentimentScore * d.totalSentimentNum) + sentimentScore) / (d.totalSentimentNum + 1);
            d.totalSentimentNum++;
            updateRecentTweetSentiments(data.text, sentimentScore);
            saveData();
            //console.log('Total: ' + totalSentimentNum);
            //console.log('Average: ' + averageSentimentScore);
            //console.log(sentimentScore + ' - ' + data.text + '\n\n');
        }
    });
});

setInterval(function() {
    stockPriceChecker.downloadAllSectorPrices(function(quotes) {
        firebaseQuotes.set(quotes);
        if (previousIterationSentiments.length === previousIterationsToTrackAverage) {
            //Time to check for buy/sell!
            var avg = mathematician.calculateMeanVarianceAndDeviation(previousIterationSentiments);
            var buyAmount = avg.mean + (avg.deviation * numStdDeviations);
            var sellAmount = avg.mean - (avg.deviation * numStdDeviations);
            console.log(avg);
            console.log(d.averageSentimentScore);
            if (d.averageSentimentScore > buyAmount && d.money > 0) {
                stockBroker.buyStocks(quotes, function(cost, stocksPurchased) {
                    d.money -= cost;
                    d.stocksOwned += stocksPurchased;
                    saveData();
                });
            }
            else if (d.averageSentimentScore < sellAmount && d.stocksOwned > 0) {
                stockBroker.sellStocks(quotes, function(cost, stocksSold) {
                    d.money += cost;
                    d.stocksOwned -= stocksSold;
                    saveData();
                });
            }
        }
        prepareNextIteration(quotes);
    });
}, iterationLengthSeconds * 1000);

