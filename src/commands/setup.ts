import { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
import RyderCommand from "../base";

export default class Setup extends RyderCommand {
    static description = "Initialize a Ryder.";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
    };

    async run() {
        if (!this.ryder_serial) {
            return;
        }
        const response = await this.ryder_serial.send(RyderSerial.COMMAND_SETUP);
        const info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);
        this.ryder_serial.close();
    }
}
