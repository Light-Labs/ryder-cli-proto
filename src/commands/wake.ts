import { flags } from '@oclif/command'
import RyderCommand from '../base'
import RyderSerial from 'ryderserial-proto'

export default class Wake extends RyderCommand {
  static description = 'Wake up the Ryder.'

  static flags = {
    ...RyderCommand.flags,
    help: flags.help({char: 'h'})
  }

  async run() {
    if (!this.ryder_serial) {
      return;
    }

    await this.ryder_serial.send(RyderSerial.COMMAND_WAKE);
    this.ryder_serial.close();
  }
}
