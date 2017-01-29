var fs = require('fs');
var McpAdc = require('mcp-adc');
var adc;

// TODO, i2c, 1wire

var Gpio = require('onoff').Gpio,
		leds = {},
		ledGpioMap = {
			1: 14,
			2: 15,
			3: 18,
			4: 27
		},
		buttonGpioMap = {
			1: 23,
			2: 22,
			3: 24,
			4: 25
		},
		buttons = {};

try {
    fs.accessSync('/dev/spidev0.0', fs.F_OK);

	adc = new McpAdc.Mcp3208();
} catch (e) {
    console.warn('SPI device /dev/spidev0.0 not found. Will simulate ADC.');
}

exports.readAdcValue = function (channel, callback) {
	if (adc) {
		adc.readRawValue(channel, function (value) {
			if (callback) {
				callback(channel, value);
			}
		});
	} else {
		if (callback) {
			callback(channel, undefined);
		}
	}
};

exports.readAdcTemp = function (probe, callback) {

	var channel = probe.channel;

	exports.readAdcValue(channel, function (channel, value) {
		if (value == undefined || value === 0) {
			if (callback) {
				callback(channel, undefined);
			}
		}

		var tempResistor = probe.resistor * ((probe.maxvalue / value) - 1);
		var volts = Math.log(tempResistor / probe.rn);

		// steinhart-hart
		var temp = (1 / (probe.a + (probe.b * volts) + (probe.c * volts * volts))) - 273;

		if (probe.adjust) {
			temp = temp * probe.adjust;
		}
		temp = parseFloat(temp).toFixed(1);

		if (callback) {
			callback(channel, temp);
		}
	});
};

var getLed = function(index) {
	if (!leds.hasOwnProperty(index) && ledGpioMap.hasOwnProperty(index)) {
		leds[index] = new Gpio(ledGpioMap[index], 'out')
	}
	return leds[index];
};
var getButton = function(index) {
	if (!buttons.hasOwnProperty(index) && buttonGpioMap.hasOwnProperty(index)) {
		buttons[index] = new Gpio(buttonGpioMap[index], 'in', 'both');
	}
	return buttons[index];
};

exports.led = function(index, value) {
	getLed(index).writeSync(value);
};
exports.ledOn = function(index) {
	exports.led(index, 1);
};
exports.ledOff = function(index) {
	exports.led(index, 0);
};
exports.led1On = function() {
	exports.ledOn(1);
};
exports.led1Off = function() {
	exports.ledOff(1);
};
exports.led2On = function() {
	exports.ledOn(2);
};
exports.led2Off = function() {
	exports.ledOff(2);
};
exports.led3On = function() {
	exports.ledOn(3);
};
exports.led3Off = function() {
	exports.ledOff(3);
};
exports.led4On = function() {
	exports.ledOn(4);
};
exports.led4Off = function() {
	exports.ledOff(4);
};

exports.onButton = function (index, callback) {
	if (callback) {
		var button = getButton(index);
		button.watch(function(err, value) {
			callback(value);
		});
	}
};
exports.onButton1 = function (callback) {
	exports.onButton(1, callback);
};
exports.onButton2 = function (callback) {
	exports.onButton(2, callback);
};
exports.onButton3 = function (callback) {
	exports.onButton(3, callback);
};
exports.onButton4 = function (callback) {
	exports.onButton(4, callback);
};
