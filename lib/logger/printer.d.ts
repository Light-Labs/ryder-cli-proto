export declare const enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
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
export declare class Printer {
    static DEBUG: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    static INFO: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    static WARN: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    static ERROR: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    private static _log;
    static log(message?: string, extra?: Record<string, unknown>): void;
    static debug(message: string, extra?: Record<string, unknown>): void;
    static info(message: string, extra?: Record<string, unknown>): void;
    static warn(message: string, extra?: Record<string, unknown>): void;
    static error(message: string, extra?: Record<string, unknown>): void;
    static print_welcome(disable_color?: boolean): void;
}
