#!/usr/bin/env node

import yargs, {Argv} from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
// import program from "commander";
import package_info from "../package-lock.json";
import RyderSerial from "ryderserial-proto";
import fs from "fs";

// import modules in each file found in src/cmds/ directory
const normalize_path = path.join(__dirname, "cmds");
// map through each command file and snag the `export.command` name to allow for modular list of valid commands (no hard-coding)
const valid_commands = fs.readdirSync(normalize_path)
  .map(cmd =>
    require(`./cmds/${cmd}`).command.split(" ")[0]
  );

// Continue application logic below

const usage = `Ryder Prototype CLI ${package_info.version}.\n\nAll commands require the Ryder port to be set. You can do this by\neither specifying it with the option --ryder-port or by exporting\nthe environment variable RYDER_PORT.\n\nWarning: this is prototype software, never use your real seed phrases.\n\nUse --help to see a list of commands.`;

let ryder_serial: RyderSerial | null;



yargs(hideBin(process.argv))
  .command('*', false, {}, (args) => {
    console.log(usage);
  })
  .middleware(function(argv) {
    if (!argv._.length) {
      return argv;
    }
    // if the given command is not valid, exit out
    if (!(valid_commands.includes(argv._[0]))) {
      console.log(`Invalid command: ${argv._[0]} is not a valid command.\nUse --help to see a list of commands.`);
      process.exit(0);
    }
    if (!argv['ryder-port'] || argv['ryder-port'] === true) {
      if (process.env.RYDER_PORT) {
        argv['ryder-port'] = process.env.RYDER_PORT;
      }
      else {
        console.log("Missing Ryder serial port, specify it with --ryder-port or set environment\nvariable RYDER_PORT.");
        process.exit(0);
      }
    }
    return argv
  })
  .middleware(async function(argv) {
    if (!argv._.length) {
      return argv;
    }
    ryder_serial = new RyderSerial(argv['ryder-port'] as string, { debug: process.env.RYDERSERIAL_DEBUG ? !!parseInt(process.env.RYDERSERIAL_DEBUG) : undefined });
    process.on('unhandledRejection', function(error) {
      console.error(error);
      try {
        ryder_serial?.close();
      } catch (e) {/* error ignored */}
      process.exit(1);
    });
    return new Promise<typeof argv>(resolve => {
      ryder_serial?.on('failed', function(error) {
        console.log('Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was:',error);
        process.exit();
      });
      ryder_serial?.on('open', async function() {
        const info = await ryder_serial?.send(RyderSerial.COMMAND_INFO);
        if (!info || info.substr(0,5) !== 'ryder') {
          console.error(`Device at ${argv.ryder_port} does not appear to be a Ryder device`);
          process.exit(0);
        }
        resolve(argv);
      });
      ryder_serial?.on('wait_user_confirm', () => console.log('Confirm or cancel on Ryder device.'));
    });
  })
  .commandDir('cmds')
  .option('ryder-port',{describe:'Ryder serial port path',type:'string'})
  .help()
  .usage(usage)
  .argv;
