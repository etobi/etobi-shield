var McpAdc = require('mcp-adc'),
		adc = new McpAdc.Mcp3208();

exports.readAdcValue = function (channel, callback) {
	adc.readRawValue(channel, function (value) {
		if (callback) {
			callback(channel, value);
		}
	});
	/*
	// TODO
	var max = 620,
			min = 590;
	var value = Math.floor(Math.random() * (max - min + 1) + min);
	if (callback) {
		callback(channel, value);
	}
	*/
};

exports.readAdcTemp = function (probe, callback) {

	var channel = probe.channel;

	exports.readAdcValue(channel, function (channel, value) {
		if (value === 0) return 999.9;

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
