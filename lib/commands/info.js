"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
const base_1 = tslib_1.__importDefault(require("../base"));
const logger_1 = require("../logger");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class Hello extends base_1.default {
    async run() {
        const { flags } = this.parse(Hello);
        if (!this.ryder_serial) {
            return;
        }
        const info = await this.ryder_serial.send(ryderserial_proto_1.default.COMMAND_INFO);
        logger_1.Printer.log(`${!!info.charCodeAt(9) ? 'I' : 'Uni'}nitialised Ryder FW version ${info.charCodeAt(5)}.${info.charCodeAt(6)}.${info.charCodeAt(7)} on ${chalk_1.default.yellow(flags.ryder_port)}`);
        this.ryder_serial.close();
    }
}
exports.default = Hello;
Hello.description = 'Read Ryder device information.';
Hello.examples = [
    `$ ryder-cli-proto info -R "/dev/ttys003"\nhello world from ./src/hello.ts!\n`,
    `$ ryder-cli-proto info --ryder-port "/dev/ttys003"\nInitialised Ryder FW version 0.0.2 on /dev/ttys003`
];
Hello.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
