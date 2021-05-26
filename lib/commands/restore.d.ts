import { flags } from '@oclif/command';
import RyderCommand from '../base';
export default class Restore extends RyderCommand {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        mnemonic: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        seed: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        ryder_port: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
}
