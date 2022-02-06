import { flags } from "@oclif/command";
import RyderCommand from "../base";
import RyderSerial from "ryderserial-proto";
import { getAddressFromPublicKey } from "@stacks/transactions";
import { TransactionVersion } from "@stacks/common";

export default class Export extends RyderCommand {
    static description = "Export an identity or key from a Ryder";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
        private_key: flags.string({ char: "k", description: "Include private key (if available)" }),
    };

    static strict = false;

    static args = [
        {
            name: "what",
            required: true,
            description: "what to export",
            options: ["identity", "owner_key", "app_key"],
        },
        {
            name: "id_number",
            required: true,
            description: "identity number of thing to export",
        },
        {
            name: "app_domain",
            required: false,
            description: "Required when exporting an app key",
        },
    ];

    async run() {
        const { args, flags } = this.parse(Export);
        if (!this.ryder_serial) {
            return;
        }
        const commands: number[] = [];
        if (args.what === "identity") commands.push(RyderSerial.COMMAND_EXPORT_PUBLIC_IDENTITY);
        else {
            // TODO: RyderSerial.COMMAND_EXPORT_OWNER_APP_KEY_PRIVATE_KEY
            if (args.what === "owner_key") {
                commands.push(
                    flags.private_key
                        ? RyderSerial.COMMAND_EXPORT_OWNER_KEY_PRIVATE_KEY
                        : RyderSerial.COMMAND_EXPORT_OWNER_KEY
                );
            } else {
                // app_key
                commands.push(
                    flags.private_key
                        ? RyderSerial.COMMAND_EXPORT_APP_KEY_PRIVATE_KEY
                        : RyderSerial.COMMAND_EXPORT_APP_KEY
                );
            }
        }
        commands.push(args.id_number);
        let response = await this.ryder_serial.send(commands);
        if (args.what !== "app_key") {
            console.log(typeof response === 'number' ? response : Buffer.from(response, 'binary').toString('hex'));
        } else if (response !== RyderSerial.RESPONSE_SEND_INPUT) {
            console.log(
                "Ryder did not request user input, it might doing something else or it is stuck in the wrong mode."
            );
        } else {
            response = await this.ryder_serial.send(args.app_domain + "\0");
            if (response !== RyderSerial.RESPONSE_REJECTED) {
                console.log(typeof response === 'number' ? response : Buffer.from(response, 'binary').toString('hex'));
            }
        }
        if (args.what === "identity" && typeof response === 'string') {
            const buff = Buffer.from(response, 'binary');
            console.log(getAddressFromPublicKey(buff, TransactionVersion.Mainnet));
            console.log(getAddressFromPublicKey(buff, TransactionVersion.Testnet));
        }
        this.ryder_serial.close();
    }
}
