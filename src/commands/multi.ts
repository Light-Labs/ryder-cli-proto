import { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
import RyderCommand from "../base";

export default class Multi extends RyderCommand {
    static description = "Run multiple commands in sequence.";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
    };

    async run() {
        if (!this.ryder_serial) {
            return;
        }

        let response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        let info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);

        response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);

        response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);

        const commands: number[] = [];
        commands.push(RyderSerial.COMMAND_EXPORT_APP_KEY);
        commands.push(1);

        response = await this.ryder_serial.send(commands);
        if (response !== RyderSerial.RESPONSE_SEND_INPUT) 
        {
            console.log("Ryder did not request user input, it might doing something else or it is stuck in the wrong mode.");
        } 
        else 
        {
            try{
            response = await this.ryder_serial.send("\0");

            if (response !== RyderSerial.RESPONSE_REJECTED) 
                console.log(typeof response === 'number' ? response : Buffer.from(response, 'binary').toString('hex'));
            }
            catch{}
        }

        response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);

        response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        info = typeof response === "number" ? response.toString() : response;
        this.log(`${info}`);

        this.ryder_serial.close();
    }
}
