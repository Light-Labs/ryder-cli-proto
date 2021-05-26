import Command, { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
export default abstract class RyderCommand extends Command {
    ryder_serial?: RyderSerial;
    static flags: {
        ryder_port: flags.IOptionFlag<string>;
        debug: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    init(): Promise<unknown>;
    finally(err?: Error): Promise<any>;
    log(message?: string | undefined, ...args: any[]): void;
    warn(message?: string | Error, ...args: any[]): void;
}
