const RyderSerial = require('ryderserial-proto');

exports.command = 'export <what> <identity number> [app domain]';
exports.desc = 'Export an identity or key from a Ryder.';
exports.builder = yargs =>
	yargs
		.positional('what',{type:'string',choices:['identity','owner_key','app_key']})
		.positional('identity number',{type:'number'})
		.positional('app domain',{describe:'Required when exporting an app key'})
		.option('private-key',{describe:'Include private key (if available)'})
		.check(argv => {if (argv.what === 'app_key' && !argv.appdomain) throw Error('App domain required.'); return true});

exports.handler = async function(argv)
	{
	let commands = [];
	if (argv.what === 'identity')
		commands.push(RyderSerial.COMMAND_EXPORT_PUBLIC_IDENTITY);
	else
		{
		//TODO- RyderSerial.COMMAND_EXPORT_OWNER_APP_KEY_PRIVATE_KEY
		if (argv.what === 'owner_key')
			commands.push(argv.privateKey ? RyderSerial.COMMAND_EXPORT_OWNER_KEY_PRIVATE_KEY : RyderSerial.COMMAND_EXPORT_OWNER_KEY);
		else // app_key
			commands.push(argv.privateKey ? RyderSerial.COMMAND_EXPORT_APP_KEY_PRIVATE_KEY : RyderSerial.COMMAND_EXPORT_APP_KEY);
		}
	commands.push(argv.identitynumber);
	let response = await argv._ryder_serial.send(commands);
	if (argv.what !== 'app_key')
		console.log(response);
	else
		{
		if (response !== RyderSerial.RESPONSE_SEND_INPUT)
			console.log('Ryder did not request user input, it might doing something else or it is stuck in the wrong mode.');
		else
			{
			response = await argv._ryder_serial.send(argv.appdomain+"\0");
			if (response !== RyderSerial.RESPONSE_REJECTED)
				console.log(response);
			}
		}
	argv._ryder_serial.close();
	}
