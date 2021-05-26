"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../base"));
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
class Wake extends base_1.default {
    async run() {
        if (!this.ryder_serial) {
            return;
        }
        await this.ryder_serial.send(ryderserial_proto_1.default.COMMAND_WAKE);
        this.ryder_serial.close();
    }
}
exports.default = Wake;
Wake.description = 'Wake up the Ryder.';
Wake.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
