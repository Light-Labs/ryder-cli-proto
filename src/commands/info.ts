import { flags } from '@oclif/command'
import RyderSerial from 'ryderserial-proto';
import RyderCommand from "../base";
import chalk from "chalk";

export default class Info extends RyderCommand {
  static description = 'Read Ryder device information.'

  static examples = [
    `$ ryder-cli-proto info -R "/dev/ttys003"\nhello world from ./src/hello.ts!\n`,
    `$ ryder-cli-proto info --ryder-port "/dev/ttys003"\nInitialised Ryder FW version 0.0.2 on /dev/ttys003`
  ]

  static flags = {
    ...RyderCommand.flags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const { flags } = this.parse(Info);
    if (!this.ryder_serial) {
      return;
    }
    const info = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
    this.log(`${!!info.charCodeAt(9) ? 'I' : 'Uni'}nitialised Ryder FW version ${info.charCodeAt(5)}.${info.charCodeAt(6)}.${info.charCodeAt(7)} on ${chalk.yellow(flags.ryder_port)}`
    );
	  this.ryder_serial.close();
  }
}
