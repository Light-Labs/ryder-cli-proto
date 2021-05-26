"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../base"));
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
class Export extends base_1.default {
    async run() {
        const { args, flags } = this.parse(Export);
        if (!this.ryder_serial) {
            return;
        }
        let commands = [];
        if (args.what === 'identity')
            commands.push(ryderserial_proto_1.default.COMMAND_EXPORT_PUBLIC_IDENTITY);
        else {
            // TODO: RyderSerial.COMMAND_EXPORT_OWNER_APP_KEY_PRIVATE_KEY
            if (args.what === 'owner_key') {
                commands.push(flags.private_key ? ryderserial_proto_1.default.COMMAND_EXPORT_OWNER_KEY_PRIVATE_KEY : ryderserial_proto_1.default.COMMAND_EXPORT_OWNER_KEY);
            }
            else { // app_key
                commands.push(flags.private_key ? ryderserial_proto_1.default.COMMAND_EXPORT_APP_KEY_PRIVATE_KEY : ryderserial_proto_1.default.COMMAND_EXPORT_APP_KEY);
            }
        }
        commands.push(args.id_number);
        let response = await this.ryder_serial.send(commands);
        if (args.what !== 'app_key') {
            console.log(response);
        }
        else if (response !== ryderserial_proto_1.default.RESPONSE_SEND_INPUT) {
            console.log('Ryder did not request user input, it might doing something else or it is stuck in the wrong mode.');
        }
        else {
            response = await this.ryder_serial.send(args.app_domain + "\0");
            if (response !== ryderserial_proto_1.default.RESPONSE_REJECTED) {
                console.log(response);
            }
        }
        this.ryder_serial.close();
    }
}
exports.default = Export;
Export.description = 'Export an identity or key from a Ryder';
Export.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }), private_key: command_1.flags.string({ char: 'k', description: 'Include private key (if available)' }) });
Export.strict = false;
Export.args = [
    {
        name: 'what',
        required: true,
        description: "what to export",
        options: ["identity", "owner_key", "app_key"]
    },
    {
        name: "id_number",
        required: true,
        description: "identity number of thing to export",
    },
    {
        name: "app_domain",
        required: false,
        description: "Required when exporting an app key"
    },
];
