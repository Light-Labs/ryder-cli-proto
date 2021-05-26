"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
const base_1 = tslib_1.__importDefault(require("../base"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class Info extends base_1.default {
    async run() {
        const { flags } = this.parse(Info);
        if (!this.ryder_serial) {
            return;
        }
        const response = await this.ryder_serial.send(ryderserial_proto_1.default.COMMAND_INFO);
        const info = typeof response === "number" ? response.toString() : response;
        this.log(`${!!info.charCodeAt(9) ? 'I' : 'Uni'}nitialised Ryder FW version ${info.charCodeAt(5)}.${info.charCodeAt(6)}.${info.charCodeAt(7)} on ${chalk_1.default.yellow(flags.ryder_port)}`);
        this.ryder_serial.close();
    }
}
exports.default = Info;
Info.description = 'Read Ryder device information.';
Info.examples = [
    `$ ryder-cli-proto info -R "/dev/ttys003"\nhello world from ./src/hello.ts!\n`,
    `$ ryder-cli-proto info --ryder-port "/dev/ttys003"\nInitialised Ryder FW version 0.0.2 on /dev/ttys003`
];
Info.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
