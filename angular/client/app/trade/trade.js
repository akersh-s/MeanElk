 'use strict';
 angular.module('angularApp').config(function($stateProvider) {
 	$stateProvider.state('trade', {
 		url: '/state',
 		templateUrl: 'app/trade/trade.html',
 		controller: 'TradeController'
 	});
 });