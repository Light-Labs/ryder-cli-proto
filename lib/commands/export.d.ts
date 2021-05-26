import { flags } from '@oclif/command';
import RyderCommand from "../base";
export default class Export extends RyderCommand {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        private_key: flags.IOptionFlag<string | undefined>;
        ryder_port: flags.IOptionFlag<string>;
    };
    static strict: boolean;
    static args: ({
        name: string;
        required: boolean;
        description: string;
        options: string[];
    } | {
        name: string;
        required: boolean;
        description: string;
        options?: undefined;
    })[];
    run(): Promise<void>;
}
