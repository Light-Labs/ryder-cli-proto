"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
const base_1 = tslib_1.__importDefault(require("../base"));
class Setup extends base_1.default {
    async run() {
        if (!this.ryder_serial) {
            return;
        }
        await this.ryder_serial.send(ryderserial_proto_1.default.COMMAND_SETUP);
        this.ryder_serial.close();
    }
}
exports.default = Setup;
Setup.description = 'Initialize a Ryder.';
Setup.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
