
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

shield.display.oled.turnOffDisplay();
setTimeout(function(){
	shield.display.oled.turnOnDisplay();
}, 1000);

shield.display.writeLine(0, '0123456789 1234567');
shield.display.writeLine(1, '1 192.168.000.123');
shield.display.writeLine(2, '2 äöü ÄÖÜ');
shield.display.writeLine(3, '3 °!"§$%&/(){}<>=?');
shield.display.writeLine(4, '4');
shield.display.writeLine(5, '5');
shield.display.writeLine(6, '6 000.00  |  000.00');
shield.display.writeLine(7, '7 123.45  |  234.56');
