angular.module('frontEndApp').service('RecentMessage', function() {
	return function(array) {
		this.message = array[0];
		this.sentiment = array[1];
	};
});