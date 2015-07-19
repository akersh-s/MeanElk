'use strict';

angular.module('buyerSeller', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'googlechart',
  'firebase'
]).config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});