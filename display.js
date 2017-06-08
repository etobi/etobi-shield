
var Oled = require('oled-ssd1306-i2c');
var font = require('oled-font-5x7');

var createOled = function () {
	var opts = {
		width: 128,
		height: 64
	};

	var oledInstance = new Oled(opts);
	oledInstance.turnOnDisplay();
	oledInstance.fillRect(1, 1, 128, 64, 0);

	return oledInstance;
};

module.exports = {
	oled: createOled(),
	writeLine: function (line, text) {
		module.exports.oled.setCursor(1, 1 + (line * 8));
		module.exports.oled.writeString(font, 1, String(text), 1, false);
	}
};
