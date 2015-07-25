String.prototype.contains = function(substring, isAlreadyLowerCase) {
	var string = this;
	if (!isAlreadyLowerCase) {
		string = string.toLowerCase();
	}
	substring = substring.toLowerCase();
	return string.indexOf(substring) !== -1;
};

String.prototype.containsAny = function(substrings) {
	var string = this.toLowerCase();
	for (var i = 0; i < substrings.length; i++) {
		if (this.contains(substrings[i], true)) {
			return true;
		}
	}
	return false;
};