'use strict';

angular.module('buyerSeller').config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('main', {
		url: '/',
		controller: 'MainController',
		controllerAs: 'main',
		templateUrl: 'app/main/main.html'
	});
	$urlRouterProvider.otherwise('/');
}).controller('MainController', function(chart, $interval, $firebaseArray, $firebaseObject) {
	var vm = this;
	var root = new Firebase('https://buyer-seller.firebaseio.com/');
	var c = this.chart = chart.chartInfo;
	this.recentMessages = $firebaseArray(root.child('recentTweetSentiments'));
	this.sentimentData = $firebaseObject(root.child('sentimentData'));
	this.quotes = $firebaseArray(root.child('quotes'));

	var chartIndex = 0;
	var previousNum = 0;
    var addToChart = function() {
        var description = '';
        if (!vm.sentimentData || !vm.sentimentData.averageSentimentScore) {
        	return;
        }
        var averageSentiment = vm.sentimentData.averageSentimentScore * 1000;
        if (chartIndex % 1 === 0) {
            description = new Date();
        }
        var col = [
            {v: description},
            {v: averageSentiment}
        ];
        //sentimentData/previousIterationSentiments
        if (vm.sentimentData && vm.sentimentData.previousIterationSentiments) {
        	var previousIterationSentiments = vm.sentimentData.previousIterationSentiments;
        	var previousIterationsAmount = previousIterationSentiments.length;
        	var i = 1;
        	angular.forEach(previousIterationSentiments, function(previousIterationSentiment) {
        		if (c.data.cols.length < 2 + previousIterationsAmount) {
        			c.data.cols.push({id: 'prev' + i, label: i + ' ago', type: 'number'});
        		}
        		col.push({v: previousIterationSentiment * 1000});
        		i++;
        	});	
        }
        c.data.rows.push({
            c: col
        });

        chartIndex++;
        if (vm.sentimentData.totalSentimentNum < previousNum) {
        	c.data.rows = [];
        }
        else if (c.data.rows.length > 50) {
            c.data.rows.shift();
        }
        previousNum = vm.sentimentData.totalSentimentNum;
    };
	$interval(addToChart, 100);
});