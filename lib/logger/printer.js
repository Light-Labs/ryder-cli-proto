"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Printer = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const clear_1 = tslib_1.__importDefault(require("clear"));
const figlet_1 = tslib_1.__importDefault(require("figlet"));
// just a handful of the few fonts I liked for a `Ryder CLI` banner message
// kinda fun. super unnecessary.
const cool_fonts = [
    "Electronic",
    "Nancyj-Fancy",
    "Nancyj-Underlined",
    "Nancyj",
    "Rowan Cap",
    "Rounded",
    "Train",
    "Whimsy",
    "Univers",
];
/**
 * the main entry point to communicate with the client by printing to the terminal.
 *
 * @remarks
 * This is called `Printer` instead of `Logger` b/c I'd like to to implement
 * a more efficient `Logger` & `LogManager` class in the future. But I wanted
 * to keep an abstracted API for printing around. (Especially to reduce
 * the `console.log` statements throughout our codebase)
 *
 * @alpha
 */
class Printer {
    static _log(log_level, message, extra) {
        if (extra) {
            console[log_level](message, extra);
            return;
        }
        if (message) {
            console[log_level](message);
            return;
        }
        console[log_level]();
    }
    static log(message, extra) {
        // hackish work-around b/c this will change as soon as I implement a real logger.
        this._log("log", message, extra);
    }
    static debug(message, extra) {
        this._log("debug" /* DEBUG */, Printer.DEBUG(message), extra);
    }
    static info(message, extra) {
        this._log("info" /* INFO */, Printer.INFO(message), extra);
    }
    static warn(message, extra) {
        this._log("warn" /* WARN */, Printer.WARN(message), extra);
    }
    static error(message, extra) {
        this._log("error" /* ERROR */, Printer.ERROR(message), extra);
    }
    static print_welcome(disable_color = false) {
        clear_1.default();
        const welcome_banner_no_color = figlet_1.default.textSync("Ryder CLI", {
            font: "Univers",
            horizontalLayout: 'full',
            whitespaceBreak: true
        });
        const welcome_banner = disable_color
            ? welcome_banner_no_color
            : chalk_1.default `{yellow.bold.bgBlue ${welcome_banner_no_color}}`;
        console.log(welcome_banner);
        !disable_color && chalk_1.default.reset();
        console.log();
    }
}
exports.Printer = Printer;
// TRACE & LOG are not colored.
Printer.DEBUG = chalk_1.default.yellow;
Printer.INFO = chalk_1.default.blueBright;
Printer.WARN = chalk_1.default.hex('#FFA500');
Printer.ERROR = chalk_1.default.red.bold;
