'use strict';

angular.module('frontEndApp').controller('MainCtrl', function ($scope, $websocket, $timeout, RecentMessage) {
	var tweetStream = $websocket('ws://localhost:6696/transmitter');
	var maxRecentSize = 100;
	$scope.totalMessages = 0;
	$scope.recentMessages = [];
	var c = $scope.chart = {};


	
    c.type = 'LineChart';
    //chart1.displayed = false;
    c.data = {
    	cols: [
        	{id: "month", label: "Month", type: "string"},
        	{id: "Sentiment-id", label: "Sentiment", type: "number"}
    	],
    	rows: []
    };
 	var rows = c.data.rows;   
	tweetStream.onMessage(function(message) {
		var array = JSON.parse(message.data);
		var recentMessage = new RecentMessage(array);
		addToRecent(recentMessage);
	});
    var averageSentiment = 50;
    var sentiments = 1;
	var addToRecent = function(recentMessage) {
		$scope.recentMessages.push(recentMessage);
		if ($scope.recentMessages.length > maxRecentSize) {
			$scope.recentMessages.shift();
		}
        averageSentiment = $scope.averageSentiment = ((averageSentiment * sentiments) + recentMessage.sentiment) / (sentiments + 1);
        if (sentiments < 100) {
            sentiments++;
            $scope.sentiments = sentiments;            
        }
	};

    var chartIndex = 0
    var addToChart = function() {
        var description = '';
        if (chartIndex % 1 === 0) {
            description = new Date();
            console.log(description);
        }
        c.data.rows.push({
            c: [
                {v: description},
                {v: averageSentiment}
            ]
        });
        chartIndex++;
        if (c.data.rows.length > 50) {
            c.data.rows.shift();
        }
        $timeout(addToChart, 100);
    }
    addToChart();
    c.options = {
        "title": "Sales per month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
            "title": "Sales unit", "gridlines": {"count": 10}
        },
        "hAxis": {
            "title": "Date"
        }
    };
    $scope.chartReady = function () {
        //fixGoogleChartsBarsBootstrap();
    }
	
	/*var addMock = function() {
		var num = Math.random();
		var mood = 'Negative';
		if (num > 0.33 && num < 0.66) {
			mood = 'Neutral';
		}
		else if (num >= 0.66) {
			mood = 'Positive';
		}
		addToRecent(new RecentMessage(['Message ' + Math.random(), mood]));
		num++;
		$timeout(addMock, 25);
	};
	addMock();*/

    function fixGoogleChartsBarsBootstrap() {
        // Google charts uses <img height="12px">, which is incompatible with Twitter
        // * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
        // *
        // * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
        // * BUT we can't change the way Google Charts renders its bars. Nor can we change
        // * the Twitter bootstrap CSS and remain future proof.
        // *
        // * Instead, this function can be called after a Google charts render to "fix" the
        // * issue by setting the style attributes dynamically.

        $(".google-visualization-table-table img[width]").each(function (index, img) {
            $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
        });
    };
});
