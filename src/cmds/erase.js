const RyderSerial = require('ryderserial-proto');

exports.command = 'erase';
exports.desc = 'Erase a Ryder.';
exports.builder = {};
exports.handler = async function(argv)
	{
	await argv._ryder_serial.send(RyderSerial.COMMAND_ERASE);
	argv._ryder_serial.close();
	}
