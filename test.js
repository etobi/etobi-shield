
var shield = require('./index.js');

shield.readAdcValue(0, function (channel, value) {
	console.log('Ch#0: ' + value);
});

shield.readAdcValue(1, function (channel, value) {
	console.log('Ch#1: ' + value);
});

shield.onButton1(function (value) {
	console.log('button1: ' + value);
	shield.led(1, 1 - value);
});
shield.onButton2(function (value) {
	console.log('button2: ' + value);
	shield.led(2, 1 - value);
});
shield.onButton3(function (value) {
	console.log('button3: ' + value);
	shield.led(3, 1 - value);
});
shield.onButton4(function (value) {
	console.log('button4: ' + value);
	shield.led(4, 1 - value);
});

shield.oled().clearDisplay();
shield.oled().drawPixel([
    [128, 1, 1],
    [128, 32, 1],
    [128, 16, 1],
    [64, 16, 1]
]);