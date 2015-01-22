'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope) {
	var dataPoints = [
                [44.651144316,-89.586260171, 50.5],
                [44.75, -63.5, 4.8] ];
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
                            data: dataPoints,
                            visible: true
                        }
                    }
                }
            });
});