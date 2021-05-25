import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

// just a handful of the few fonts I liked for a `Ryder CLI` banner message
// kinda fun. super unnecessary.
const cool_fonts = [
  "Electronic",
  "Nancyj-Fancy",
  "Nancyj-Underlined",
  "Nancyj",
  "Rowan Cap",
  "Rounded",
  "Train", // lol
  "Whimsy",
  "Univers",
]

export const enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
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
export class Printer {
  // TRACE & LOG are not colored.
  static DEBUG = chalk.yellow;
  static INFO = chalk.blueBright;
  static WARN = chalk.hex('#FFA500');
  static ERROR = chalk.red.bold;

  private static _log(log_level: LogLevel, message?: string, extra?: Record<string, unknown>): void {
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

  public static log(message?: string, extra?: Record<string, unknown>) {
    // hackish work-around b/c this will change as soon as I implement a real logger.
    this._log("log" as LogLevel, message, extra);
  }

  public static debug(message?: string, extra?: Record<string, unknown>): void {
    this._log(LogLevel.DEBUG, Printer.DEBUG(message), extra);
  }

  public static info(message?: string, extra?: Record<string, unknown>): void  {
    this._log(LogLevel.INFO, Printer.INFO(message), extra);
  }

  public static warn(message?: string | Error, extra?: Record<string, unknown>): void  {
    this._log(LogLevel.WARN, Printer.WARN(message), extra);
  }

  public static error(message?: string, extra?: Record<string, unknown>): void {
    this._log(LogLevel.ERROR, Printer.ERROR(message), extra);
  }

  public static print_welcome(disable_color=false) {
    clear();
    const welcome_banner_no_color = figlet.textSync("Ryder CLI", {
      font: "Univers",
      horizontalLayout: 'full',
      whitespaceBreak: true
    });
    const welcome_banner = disable_color
      ? welcome_banner_no_color
      : chalk`{yellow.bold.bgBlue ${welcome_banner_no_color}}`;
    console.log(welcome_banner)
    !disable_color && chalk.reset();
    console.log();
  }

}
