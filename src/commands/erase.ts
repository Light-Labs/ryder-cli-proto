import { flags } from "@oclif/command";
import RyderCommand from "../base";
import RyderSerial from "ryderserial-proto";

export default class Erase extends RyderCommand {
    static description = "Erase a Ryder.";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
    };

    async run() {
        if (!this.ryder_serial) {
            return;
        }
        const response = await this.ryder_serial.send(RyderSerial.COMMAND_ERASE);
        const info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);
        this.ryder_serial.close();
    }
}
