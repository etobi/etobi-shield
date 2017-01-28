var fs = require('fs');
var McpAdc = require('mcp-adc');
var adc;

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
