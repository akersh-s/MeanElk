'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope) {
    $scope.dataPoints = [
                [44.651144316,-89.586260171, 125.5],
                [44.75, -63.5, 125.8] ];
    var i = 0;
    $scope.addSpot = function() {
        $scope.dataPoints.push([i, -1 * i, 125.5]);
        i++;
    };
	
	$scope.center = {
        lat: 39.8282,
        lng: -98.57,
        zoom: 4
    };
    angular.extend($scope, {
    	layers: {
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
                }
            });
});