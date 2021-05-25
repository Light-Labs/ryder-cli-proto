"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importStar(require("@oclif/command"));
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
class RyderCommand extends command_1.default {
    async init() {
        const { flags } = this.parse(this.ctor);
        console.log({ flags });
        const debug = process.env.RYDERSERIAL_DEBUG ? !!parseInt(process.env.RYDERSERIAL_DEBUG) : undefined;
        this.ryder_serial = new ryderserial_proto_1.default(flags.ryder_port, { debug });
        // console.log({ flags, ryder_serial: this.ryder_serial });
        process.on('unhandledRejection', (error) => {
            var _a;
            console.error("unhandled rejection!", error);
            try {
                (_a = this.ryder_serial) === null || _a === void 0 ? void 0 : _a.close();
            }
            catch (e) { /* error ignored */ }
            process.exit(1);
        });
        return new Promise(resolve => {
            var _a, _b, _c;
            (_a = this.ryder_serial) === null || _a === void 0 ? void 0 : _a.on('failed', (error) => {
                console.log('Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was:', error);
                process.exit();
            });
            (_b = this.ryder_serial) === null || _b === void 0 ? void 0 : _b.on('open', async () => {
                var _a;
                const info = await ((_a = this.ryder_serial) === null || _a === void 0 ? void 0 : _a.send(ryderserial_proto_1.default.COMMAND_INFO));
                if (!info || info.substr(0, 5) !== 'ryder') {
                    console.error(`Device at ${RyderCommand.flags.ryder_port} does not appear to be a Ryder device`);
                    process.exit(0);
                }
                console.log({ info });
                resolve(flags);
            });
            (_c = this.ryder_serial) === null || _c === void 0 ? void 0 : _c.on('wait_user_confirm', () => console.log('Confirm or cancel on Ryder device.'));
        });
    }
    async finally(err) {
        var _a;
        const { flags } = this.parse(this.ctor);
        console.log({ flags });
        (_a = flags.ryder_serial) === null || _a === void 0 ? void 0 : _a.close();
        return super.finally(err);
    }
}
exports.default = RyderCommand;
RyderCommand.flags = {
    ryder_port: command_1.flags.string({
        char: "R",
        description: "port of ryder device to connect to",
        hidden: false,
        multiple: false,
        env: "RYDERSERIAL_PORT",
        required: true
    })
};