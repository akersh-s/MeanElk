angular.module('frontEndApp').service('RecentMessage', function() {
	return function(array) {
		this.message = array[0];
		this.mood = array[1];
	};
});