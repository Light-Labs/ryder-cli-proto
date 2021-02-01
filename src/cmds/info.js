const RyderSerial = require('ryderserial-proto');

exports.command = 'info';
exports.desc = 'Read Ryder device information.';
exports.builder = {};
exports.handler = async function(argv)
	{
	const info = await argv._ryder_serial.send(RyderSerial.COMMAND_INFO);
	console.log(`${!!info.charCodeAt(9)?'I':'Uni'}nitialised Ryder FW version ${info.charCodeAt(5)}.${info.charCodeAt(6)}.${info.charCodeAt(7)} on ${argv['ryder-port']}`);
	argv._ryder_serial.close();
	}
