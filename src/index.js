#!/usr/bin/env node

const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const package_info = require('../package.json');
const RyderSerial = require('ryderserial-proto');

const usage = `Ryder Prototype CLI ${package_info.version}.\n\nAll commands require the Ryder port to be set. You can do this by\neither specifying it with the option --ryder-port or by exporting\nthe environment variable RYDER_PORT.\n\nWarning: this is prototype software, never use your real seed phrases.\n\nUse --help to see a list of commands.`;

yargs(hideBin(process.argv))
	.command('*',false,{},argv => console.log(usage))
	.middleware(argv =>
		{
		if (!argv._.length)
			return argv;
		if (!argv['ryder-port'] || argv['ryder-port'] === true)
			{
			if (process.env.RYDER_PORT)
				argv['ryder-port'] = process.env.RYDER_PORT;
			else
				{
				console.log("Missing Ryder serial port, specify it with --ryder-port or set environment\nvariable RYDER_PORT.");
				process.exit(0);
				}
			}
		return argv;
		})
	.middleware(async argv =>
		{
		if (!argv._.length)
			return argv;
		argv._ryder_serial = new RyderSerial(argv['ryder-port'],{debug:!!parseInt(process.env.RYDERSERIAL_DEBUG)});
		process.on('unhandledRejection',error =>
			{
			console.error(error);
			try{argv._ryder_serial.close();}catch(e){}
			process.exit(1);
			});
		return new Promise(resolve =>
			{
			argv._ryder_serial.on('failed',error =>
				{
				console.log('Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was:',error);
				process.exit();
				});
			argv._ryder_serial.on('open',async () =>
				{
				const info = await argv._ryder_serial.send(RyderSerial.COMMAND_INFO);
				if (!info || info.substr(0,5) !== 'ryder')
					{
					console.error(`Device at ${config.ryder_port} does not appear to be a Ryder device`);
					process.exit(0);
					}
				resolve(argv);
				});
			argv._ryder_serial.on('wait_user_confirm',() => console.log('Confirm or cancel on Ryder device.'));
			});
		})
	.commandDir('cmds')
	.option('ryder-port',{describe:'Ryder serial port path',type:'string'})
	.help()
	.usage(usage)
	.argv;
