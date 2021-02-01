const RyderSerial = require('ryderserial-proto');

exports.command = 'setup';
exports.desc = 'Initialise a Ryder.';
exports.builder = {};
exports.handler = async function(argv)
	{
	await argv._ryder_serial.send(RyderSerial.COMMAND_SETUP);
	argv._ryder_serial.close();
	}
