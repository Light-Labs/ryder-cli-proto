import Command, { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
import { Printer } from "./logger";

export default abstract class RyderCommand extends Command {
  ryder_serial?: RyderSerial

  static flags = {
    ryder_port: flags.string({
      char: "R",
      description: "port of ryder device to connect to",
      hidden: false,
      multiple: false,
      env: "RYDERSERIAL_PORT",
      required: true
    })
  }

  async init() {
    const { flags } = this.parse(this.ctor);
    console.log({ flags });
    const debug = process.env.RYDERSERIAL_DEBUG ? !!parseInt(process.env.RYDERSERIAL_DEBUG) : undefined
    this.ryder_serial = new RyderSerial(flags.ryder_port, { debug });
    // console.log({ flags, ryder_serial: this.ryder_serial });
    process.on('unhandledRejection', (error) => {
      console.error("unhandled rejection!", error);
      try {
        this.ryder_serial?.close();
      } catch (e) {/* error ignored */}
      process.exit(1);
    });

    return new Promise(resolve => {
      this.ryder_serial?.on('failed', (error: Error) => {
        console.log('Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was:',error);
        process.exit();
      });
      this.ryder_serial?.on('open', async () => {
        const info = await this.ryder_serial?.send(RyderSerial.COMMAND_INFO);
        if (!info || info.substr(0,5) !== 'ryder') {
          console.error(`Device at ${RyderCommand.flags.ryder_port} does not appear to be a Ryder device`);
          process.exit(0);
        }
        console.log({info})
        resolve(flags);
      });
      this.ryder_serial?.on('wait_user_confirm', () => console.log('Confirm or cancel on Ryder device.'));
    });
  }

  async finally(err?: Error) {
    const { flags } = this.parse(this.ctor);
    console.log({flags});
    flags.ryder_serial?.close();
    return super.finally(err);
  }

  // message?: string | undefined, ...args: any[]): void
  log(message?: string | undefined, ...args: any[]): void {
    Printer.log(message);
  }

  warn(message?: string | Error, ...args: any[]): void {
    Printer.warn(message);
  }

}
