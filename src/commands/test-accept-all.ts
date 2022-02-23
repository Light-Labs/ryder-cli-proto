import { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
import RyderCommand from "../base";
import chalk from "chalk";

export default class TestAcceptAll extends RyderCommand {
    static description = "Set Ryder device in test mode: accept all.";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
    };

    async run() {
        const { flags } = this.parse(TestAcceptAll);
        if (!this.ryder_serial) {
            return;
        }
        const response = await this.ryder_serial.send(241);
        const info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);
        this.ryder_serial.close();
    }
}
