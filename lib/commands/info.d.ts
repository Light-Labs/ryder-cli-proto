import { flags } from '@oclif/command';
import RyderCommand from "../base";
export default class Info extends RyderCommand {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        ryder_port: flags.IOptionFlag<string>;
        debug: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
