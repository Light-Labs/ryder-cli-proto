import Command, { flags } from "@oclif/command";
import { info } from "console";
import RyderSerial from "ryderserial-proto";
import { Printer } from "./logger";

export default abstract class RyderCommand extends Command 
{
    ryder_serial?: RyderSerial;
    static flags = 
    {
        ryder_port: flags.string(
        {
            char: "R",
            description: "port of ryder device to connect to",
            hidden: false,
            multiple: false,
            env: "RYDERSERIAL_PORT",
            required: true,
        }),
        debug: flags.boolean({ char: "D" }),
    };

    async init() 
    {
        const { flags } = this.parse(this.ctor);
        let debug;
        
        if (process.env.RYDERSERIAL_DEBUG) 
        {
            debug = !!parseInt(process.env.RYDERSERIAL_DEBUG);
        } else if (RyderCommand.flags.debug) 
        {
            debug = flags.debug;
        } else 
        {
            debug = false;
        }

        this.ryder_serial = new RyderSerial(flags.ryder_port, { debug });
        if(process.env.hai == undefined)
        {
            process.env.hai = "1";
        process.on("unhandledRejection", error => 
        {
            console.error("unhandled rejection!", error);
            try 
            {
                this.ryder_serial?.close();
                //this.ryder_serial?.clear();
            } 
            catch (e) { /* error ignored */ }
            process.exit(1);
        });
    }

        return new Promise(resolve => 
        {
            this.ryder_serial?.on("failed", (error: Error) => 
            {
                console.log(
                    "Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was:",
                    error
                );
                this.ryder_serial?.close();
                delete this.ryder_serial;
                //process.exit();
                return;
            });

            this.ryder_serial?.on("open", async () => 
            {
                const response = await this.ryder_serial?.send(RyderSerial.COMMAND_INFO);
                const info = typeof response === "number" ? response.toString() : response;
                if (!info || info.substr(0, 5) !== "ryder") 
                {
                    this.log(
                        `Device at ${RyderCommand.flags.ryder_port} does not appear to be a Ryder device: ${info}`//,
                        //{ exit: 1 }
                    );
                    this.ryder_serial?.close();
                    return;
                }
                resolve(flags);
            });

            this.ryder_serial?.on("wait_user_confirm", () =>
                console.log("Confirm or cancel on Ryder device.")
            );
        });
    }

    async finally(err?: Error) 
    {
        const { flags } = this.parse(this.ctor);
        flags.ryder_serial?.close();
        return super.finally(err);
    }

    // message?: string | undefined, ...args: any[]): void
    log(message?: string | undefined, ...args: any[]): void 
    {
        Printer.log(message);
    }

    warn(message?: string | Error, ...args: any[]): void 
    {
        Printer.warn(message);
    }
}
