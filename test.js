
var shield = require('./index.js');

shield.readAdcValue(0, function (channel, value) {
	console.log('Ch#0: ' + value);
});

shield.readAdcValue(1, function (channel, value) {
	console.log('Ch#1: ' + value);
});
