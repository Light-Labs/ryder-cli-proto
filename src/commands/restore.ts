import { flags } from "@oclif/command";
import RyderCommand from "../base";
import RyderSerial from "ryderserial-proto";
import inquirer from "inquirer";

export default class Restore extends RyderCommand {
    static description = "describe the command here";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
        mnemonic: flags.integer({
            options: ["12", "18", "24"],
            description: "12, 18, or 24 word mnemonic seed phrase",
        }),
        seed: flags.integer({
            description: "seed as a number",
        }),
    };

    async run() {
        const { args, flags } = this.parse(Restore);
        if (!flags.seed && !flags.mnemonic) {
            this.error(new Error("--mnemonic OR --seed required."), { exit: 1 });
        }
        if (!this.ryder_serial) {
            return;
        }

        let response;
        try {
            response = await this.ryder_serial.send(
                flags.seed
                    ? RyderSerial.COMMAND_RESTORE_FROM_SEED
                    : [RyderSerial.COMMAND_RESTORE_FROM_MNEMONIC, flags.mnemonic as number]
            );
        } catch (error) {
            if (error.message === "RESPONSE_ERROR_NOT_IMPLEMENTED") {
                this.ryder_serial.close();
                this.log("This mode is not implemented by the device.");
                return;
            }
            throw error;
        }

        if (response !== RyderSerial.RESPONSE_SEND_INPUT) {
            this.log(
                "Ryder did not request user input, it might doing something else or it is stuck in the wrong mode."
            );
        } else {
            this.log("Follow the instructions on your Ryder. ^C to cancel.");
            let sigint_handler = async () => {
                await this.ryder_serial?.send("  ");
                this.ryder_serial?.close();
            };

            process.on("SIGINT", sigint_handler);
            while (response === RyderSerial.RESPONSE_SEND_INPUT) {
                const prompt = await inquirer.prompt([
                    {
                        name: "part",
                        type: "password",
                        message: "Input [a-z]",
                        validate: input => /^[a-z]+$/.test(input),
                    },
                ]);

                response = await this.ryder_serial.send(prompt.part + " ");
            }
            process.off("SIGINT", sigint_handler);
        }
        this.ryder_serial.close();
    }
}
