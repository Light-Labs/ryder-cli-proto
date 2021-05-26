import RyderCommand from "../base";
export default class Erase extends RyderCommand {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    run(): Promise<void>;
}
