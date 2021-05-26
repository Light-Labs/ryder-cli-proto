import { flags } from '@oclif/command';
import RyderCommand from '../base';
export default class Firmware extends RyderCommand {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        ryder_port: flags.IOptionFlag<string>;
    };
    static strict: boolean;
    static args: ({
        name: string;
        required: boolean;
        options: string[];
        description?: undefined;
    } | {
        name: string;
        description: string;
        required?: undefined;
        options?: undefined;
    })[];
    run(): Promise<void>;
}
