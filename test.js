
var shield = require('./index.js');

shield.readAdcValue(0, function (value) {
	console.log(value);
});
