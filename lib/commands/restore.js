"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../base"));
const ryderserial_proto_1 = tslib_1.__importDefault(require("ryderserial-proto"));
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
class Restore extends base_1.default {
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
            response = await this.ryder_serial.send(flags.seed
                ? ryderserial_proto_1.default.COMMAND_RESTORE_FROM_SEED
                : [ryderserial_proto_1.default.COMMAND_RESTORE_FROM_MNEMONIC, flags.mnemonic]);
        }
        catch (error) {
            if (error.message === 'RESPONSE_ERROR_NOT_IMPLEMENTED') {
                this.ryder_serial.close();
                this.log('This mode is not implemented by the device.');
                return;
            }
            throw error;
        }
        if (response !== ryderserial_proto_1.default.RESPONSE_SEND_INPUT) {
            this.log('Ryder did not request user input, it might doing something else or it is stuck in the wrong mode.');
        }
        else {
            this.log('Follow the instructions on your Ryder. ^C to cancel.');
            let sigint_handler = async () => {
                var _a, _b;
                await ((_a = this.ryder_serial) === null || _a === void 0 ? void 0 : _a.send('  '));
                (_b = this.ryder_serial) === null || _b === void 0 ? void 0 : _b.close();
            };
            process.on('SIGINT', sigint_handler);
            while (response === ryderserial_proto_1.default.RESPONSE_SEND_INPUT) {
                const prompt = await inquirer_1.default.prompt([{
                        name: 'part',
                        type: 'password',
                        message: 'Input [a-z]',
                        validate: input => /^[a-z]+$/.test(input)
                    }]);
                response = await this.ryder_serial.send(prompt.part + ' ');
            }
            process.off('SIGINT', sigint_handler);
        }
        this.ryder_serial.close();
    }
}
exports.default = Restore;
Restore.description = 'describe the command here';
Restore.flags = Object.assign(Object.assign({}, base_1.default.flags), { help: command_1.flags.help({ char: 'h' }), mnemonic: command_1.flags.integer({
        options: ["12", "18", "24"],
        description: '12, 18, or 24 word mnemonic seed phrase'
    }), seed: command_1.flags.integer({
        description: "seed as a number",
    }) });
