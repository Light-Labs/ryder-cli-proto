const RyderSerial = require('ryderserial-proto');

exports.command = 'wake';
exports.desc = 'Wake up.';
exports.builder = {};
exports.handler = async function(argv)
	{
	await argv._ryder_serial.send(RyderSerial.COMMAND_WAKE);
	argv._ryder_serial.close();
	}
