const RyderSerial = require('ryderserial-proto');
const inquirer = require('inquirer');

exports.command = 'restore';
exports.desc = 'Restore a Ryder using a mnemonic phrase. Use --mnemonic to specify the number of words.';
exports.builder = yargs =>
	yargs
		.option('mnemonic',{descibe:'12, 18, or 24 word mnemonic seed phrase',type:'number',choices:[12,18,24]})
		.option('seed',{describe:'seed as a number',type:'number'})
		.check(argv => {if(!argv.mnemonic && !argv.seed) throw new Error('--mnemonic or --seed required.'); return true});

exports.handler = async function(argv)
	{
	let response;
	try
		{
		response = await argv._ryder_serial.send(argv.seed ? RyderSerial.COMMAND_RESTORE_FROM_SEED : [RyderSerial.COMMAND_RESTORE_FROM_MNEMONIC,argv.mnemonic]);
		}
	catch (error)
		{
		if (error.message === 'RESPONSE_ERROR_NOT_IMPLEMENTED')
			{
			argv._ryder_serial.close();
			return console.log('This mode is not implemented by the device.');
			}
		throw error;
		}
	if (response !== RyderSerial.RESPONSE_SEND_INPUT)
		console.log('Ryder did not request user input, it might doing something else or it is stuck in the wrong mode.');
	else
		{
		console.log('Follow the instructions on your Ryder. ^C to cancel.');
		let sigint_handler = async () => {await argv._ryder_serial.send('  '); argv._ryder_serial.close()};
		process.on('SIGINT',sigint_handler);
		while (response === RyderSerial.RESPONSE_SEND_INPUT)
			{
			const prompt = await inquirer.prompt([{name:'part',type:'password',message:'Input [a-z]',validate: input => /^[a-z]+$/.test(input)}]);
			response = await argv._ryder_serial.send(prompt.part+' ');
			}
		process.off('SIGINT',sigint_handler);
		}
	argv._ryder_serial.close();
	}
