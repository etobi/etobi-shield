var fs = require('fs');
var McpAdc = require('mcp-adc');
var adc;

var Gpio = require('onoff').Gpio,
  led1 = new Gpio(14, 'out'),
  led2 = new Gpio(15, 'out'),
  led3 = new Gpio(18, 'out'),
  led4 = new Gpio(27, 'out');

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

exports.led1On = function() {
	led1.writeSync(1);
};
exports.led1Off = function() {
	led1.writeSync(0);
};
exports.led2On = function() {
	led2.writeSync(1);
};
exports.led2Off = function() {
	led2.writeSync(0);
};
exports.led3On = function() {
	led3.writeSync(1);
};
exports.led3Off = function() {
	led3.writeSync(0);
};
exports.led4On = function() {
	led4.writeSync(1);
};
exports.led4Off = function() {
	led4.writeSync(0);
};
