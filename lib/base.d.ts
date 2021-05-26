import Command, { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
export default abstract class RyderCommand extends Command {
    ryder_serial?: RyderSerial;
    static flags: {
        ryder_port: flags.IOptionFlag<string>;
    };
    init(): Promise<unknown>;
    finally(err?: Error): Promise<any>;
    log(message?: string | undefined, ...args: any[]): void;
    warn(message?: string | Error, ...args: any[]): void;
}
