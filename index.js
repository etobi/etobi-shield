var fs = require('fs');
var McpAdc = require('mcp-adc');
var adc;

// TODO, i2c, 1wire

var Gpio = null,
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
	Gpio = require('onoff').Gpio;
} catch (e) {
	console.warn('GPIO not found. Will simulate GPIO.');
	Gpio = function (port, direction, edge, options) {
		this.read = function (callback) {
		};
		this.readSync = function () {
		};
		this.write = function (value, callback) {
			console.log('GPIO(' + port + ', ' + direction + ').write(' + value + ')');
		};
		this.writeSync = function (value) {
			console.log('GPIO(' + port + ', ' + direction + ').writeSync(' + value + ')');
		};
		this.watch = function (callback) {
		};
		this.unwatch = function (callback) {
		};
		this.unwatchAll = function () {
		};
		this.direction = function () {
		};
		this.setDirection = function (direction) {
		};
		this.edge = function () {
		};
		this.setEdge = function (edge) {
		};
		this.activeLow = function () {
		};
		this.setActiveLow = function (invert) {
		};
		this.unexport = function () {
		};
	}
}

try {
	fs.accessSync('/dev/spidev0.0', fs.F_OK);

	adc = new McpAdc.Mcp3208();
} catch (e) {
	console.warn('SPI device /dev/spidev0.0 not found. Will simulate ADC.');
}

module.exports.readAdcValue = function (channel, callback) {
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

module.exports.readAdcTemp = function (probe, callback) {

	var channel = probe.channel;

	module.exports.readAdcValue(channel, function (channel, value) {
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

var getLed = function (index) {
	if (!leds.hasOwnProperty(index) && ledGpioMap.hasOwnProperty(index)) {
		leds[index] = new Gpio(ledGpioMap[index], 'out')
	}
	return leds[index];
};
var getButton = function (index) {
	if (!buttons.hasOwnProperty(index) && buttonGpioMap.hasOwnProperty(index)) {
		buttons[index] = new Gpio(buttonGpioMap[index], 'in', 'both');
	}
	return buttons[index];
};

module.exports.led = function (index, value) {
	var led = getLed(index);
	if (led) {
		led.writeSync(value);
	}
};
module.exports.ledOn = function (index) {
	module.exports.led(index, 1);
};
module.exports.ledOff = function (index) {
	module.exports.led(index, 0);
};
module.exports.led1On = function () {
	module.exports.ledOn(1);
};
module.exports.led1Off = function () {
	module.exports.ledOff(1);
};
module.exports.led2On = function () {
	module.exports.ledOn(2);
};
module.exports.led2Off = function () {
	module.exports.ledOff(2);
};
module.exports.led3On = function () {
	module.exports.ledOn(3);
};
module.exports.led3Off = function () {
	module.exports.ledOff(3);
};
module.exports.led4On = function () {
	module.exports.ledOn(4);
};
module.exports.led4Off = function () {
	module.exports.ledOff(4);
};

module.exports.onButton = function (index, callback) {
	if (callback) {
		var button = getButton(index);
		if (button) {
			button.watch(function (err, value) {
				callback(value);
			});
		}
	}
};
module.exports.onButton1 = function (callback) {
	module.exports.onButton(1, callback);
};
module.exports.onButton2 = function (callback) {
	module.exports.onButton(2, callback);
};
module.exports.onButton3 = function (callback) {
	module.exports.onButton(3, callback);
};
module.exports.onButton4 = function (callback) {
	module.exports.onButton(4, callback);
};
