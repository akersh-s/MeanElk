var mathematician = module.exports = {};

//Calculate the mean, variance, and deviation
mathematician.calculateMeanVarianceAndDeviation = function(a) {
	var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
	for(var m, s = 0, l = t; l--; s += a[l]);
	for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
	return r.deviation = Math.sqrt(r.variance = s / t), r;
};