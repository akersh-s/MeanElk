'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope, socket) {
    $scope.dataPoints = [];
	
	$scope.center = {
        lat: 39.8282,
        lng: -98.57,
        zoom: 4
    };
    $scope.layers = {
        baselayers: {
            osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
            }
        },
        overlays: {
            heatmap: {
                name: 'Heat Map',
                type: 'heatmap',
                data: $scope.dataPoints,
                visible: true
            }
        }
    };



    $scope.searchTwitter = function() {
        if ($scope.text && $scope.text.trim()) {
            console.log('Search Twitter with ' + $scope.text);
            var keywords = $scope.text.split(/\|/);
            angular.forEach(keywords, function(keyword) {
                keyword = keyword.trim();
            });
            socket.emit('searchTweetCount', keywords);
            $scope.err = '';
        }
        else {
            $scope.err = 'Please enter search criteria into the text box.';
        }
    };

    $scope.stopStreaming = function() {
        socket.emit('stop');
    };

    $scope.clear = function() {
        $scope.dataPoints = [];
    };
    socket.on('tweetInfo', function(tweetInfo) {
        console.log(tweetInfo);
        tweetInfo.push(25);
        $scope.dataPoints.push(tweetInfo);
    });
});