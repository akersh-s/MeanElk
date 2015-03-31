'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope, socket) {
    var setSearching = function() {
        $scope.searching = true;
        $scope.searchText = 'Stop Search';
    };

    var setNotSearching = function() {
        $scope.searching = false;
        $scope.searchText = 'Search Twitter';
    };
    setNotSearching();

    $scope.dataPoints = [];
	$scope.searching = false;

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
        if ($scope.searching) {
            socket.emit('stop');
            setNotSearching();
        }
        else {
            if ($scope.text && $scope.text.trim()) {
                var keywords = $scope.text.split(/\|/);
                angular.forEach(keywords, function(keyword) {
                    keyword = keyword.trim();
                });
                socket.emit('searchTweetCount', keywords);
                $scope.err = '';
                setSearching();
            }
        else {
            $scope.err = 'Please enter search criteria into the text box.';
        }        
        }

    };

    $scope.clear = function() {
        $scope.dataPoints = [];
        $scope.layers.overlays.heatmap.data = $scope.dataPoints;
        $scope.dataPoints.push([0,0,0]);
    };
    socket.on('tweetInfo', function(tweetInfo) {
        console.log(tweetInfo);
        tweetInfo.push(25);
        $scope.dataPoints.push(tweetInfo);
    });
});