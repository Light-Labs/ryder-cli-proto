import { flags } from "@oclif/command";
import { ParserOutput } from "@oclif/parser/lib/parse";
import RyderCommand from "../base";
import RyderSerial from "ryderserial-proto";
import fs_default, { createReadStream, existsSync, mkdir, mkdirSync, readFileSync } from "fs";
import crypto from "crypto";
import fetch from "node-fetch";
import path from "path";
import { spawn } from "child_process";
import os from "os";

const fs = fs_default.promises;
const firmware_dn = "https://github.com/Light-Labs/ryder-prototype-firmware-releases/releases/latest/download/ryder-simulator-hardware.zip";
const firmware_dn_specific = "https://github.com/Light-Labs/ryder-prototype-firmware-releases/releases/download/{version}/ryder-simulator-hardware.zip";
const firmware_versions = "https://api.github.com/repos/Light-Labs/ryder-prototype-firmware-releases/releases";

const homedir = os.homedir();

const ryder_firmware_directory =
    process.env.RYDER_FIRMWARE_DIRECTORY || path.join(homedir, ".ryder/proto-v2/firmware");
const versions_file = path.join(ryder_firmware_directory, "versions.json");

async function get_versions() {
    try {
        return JSON.parse(await fs.readFile(versions_file, "utf8"));
    } catch (error) {
        return false;
    }
}

function verify_firmware(signature: string, firmware: crypto.BinaryLike): boolean {
    if (!signature) return false;

    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(firmware);
    //return verifier.verify(firmware_dn_public_key, signature, "hex");
    //TODO: FIX ME.
    return true;
}

type FirmwareParseOutput = ParserOutput<
    {
        help: void;
        ryder_port: string;
        debug: boolean;
    },
    {
        [name: string]: any;
    }
>;

export default class Firmware extends RyderCommand {
    static description = "Manage firmware versions.";

    static flags = {
        ...RyderCommand.flags,
        help: flags.help({ char: "h" }),
    };

    // allows variable number of arguments
    static strict = false;

    static args = [
        {
            name: "action",
            required: true,
            options: ["fetch", "download", "list", "install", "version"],
        },
        {
            name: "ver",
            description: "only required on download or install",
        },
    ];

    async run(): Promise<void> {
        const output: FirmwareParseOutput = this.parse(Firmware);
        const { args } = output;

        if (
            // if `firmware install` or `firmware download`
            (args.action === "install" || args.action === "download") &&
            // then 3rd argument `ver` should be in format #.#.#
            !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(args.ver)
        ) {
            this.error(new Error("Version should be in the format X.Y.Z"), { exit: 1 });
        }

        await fs.mkdir(ryder_firmware_directory, { recursive: true });

        if (!this.ryder_serial) {
            return;
        }

        const handler: { [name: string]: (output: FirmwareParseOutput) => Promise<void> } = {
            fetch: this.handle_fetch.bind(this),
            list: this.handle_list.bind(this),
            download: this.handle_download.bind(this),
            install: this.handle_install.bind(this),
        };
        await handler[args.action](output);

        this.ryder_serial.close();
    }

    async handle_fetch(): Promise<void> {
        this.log("Fetching latest firmware versions");
        const result = await fetch(firmware_versions);
        const json = await result.json();
        json.forEach((v: { tag_name: string | string; }) => this.log(v.tag_name));
        await fs.writeFile(versions_file, JSON.stringify(json), "utf8");
    }

    async handle_list(): Promise<void> {
        if (!this.ryder_serial) {
            throw new Error("Ryder device is not connected.");
        }
        const response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
        const info = typeof response === "number" ? response.toString() : response;
        const current_version = `${info.charCodeAt(5)}.${info.charCodeAt(6)}.${info.charCodeAt(7)}`;
        const versions_list = await get_versions();
        if (!versions_list) {
            this.log("No local firmware versions found, fetch first.");
        } else {
            versions_list.forEach((v: { tag_name: string | string; }) => {
                this.log(v.tag_name === current_version ? v.tag_name + " (currently installed)" : v.tag_name);
            });
            //this.log(
                // Object.keys(versions_list)
                //     .map(v => (v === current_version ? v + " (currently installed)" : v))
                //     .join("\n")
            //);
        }
    }

    async handle_download(output: FirmwareParseOutput): Promise<void> {
        const { args } = output;
        const versions_download = await get_versions();
        if(!versions_download.some((v: { tag_name: string; }) => v.tag_name === args.ver)) {
        //if (!versions_download || !versions_download[args.ver]) {
            this.log("Unknown version. (Fetch?)");
            return;
        }
        // const file = versions_download[args.ver].file;
        const dn_link = firmware_dn_specific.replace("{version}", args.ver)
        const file_name = "ryder-simulator-hardware.zip";
        const full_path = path.join(ryder_firmware_directory, args.ver, file_name);
        const dir_path = path.dirname(full_path);
        // const signature = versions_download[args.ver].signature;
        const signature = "TODO";

        this.log(`Downloading ${file_name} from ${dn_link}`);
        const result_download = await fetch(dn_link);
        const firmware = await result_download.buffer();
        if (verify_firmware(signature, firmware)) {
            if (!existsSync(dir_path))
                mkdirSync(dir_path);
            await fs.writeFile(full_path, firmware);
        } else {
            this.log(`Firmware signature invalid for version ${args.ver}, download failed.`);
        }
    }

    async handle_install(output: FirmwareParseOutput): Promise<void> {
        if (!this.ryder_serial) {
            return;
        }

        const { args, flags } = output;
        const versions_install = await get_versions();
        if(!versions_install.some((v: { tag_name: string; }) => v.tag_name === args.ver)) {
        //if (!versions_install || !versions_install[args.ver]) {
            this.log("Unknown version. (Fetch?)");
            return;
        }

        const file_name = "ryder-simulator-hardware.zip";
        const full_path = path.join(ryder_firmware_directory, args.ver, file_name);
        const unzipped_path = path.join(ryder_firmware_directory, args.ver, "simulator");//path.basename(file_name, ".zip")
        const unzipped_file = path.join(unzipped_path, "firmware.bin");
        //const signature_install = versions_install[args.ver].signature;
        const signature_install = "TODO";

        let firmware_install;
        try {
            this.log(full_path);
            var unzipper = require("unzipper");
            createReadStream(full_path).pipe(unzipper.Extract({ path: unzipped_path }));

            this.log(unzipped_file);
            firmware_install = await fs.readFile(unzipped_file);
        } catch (error) {
            this.log(`Hallo: ${error}`);
            this.error(`Hallo: ${error}`);
            if (error.code === "ENOENT") {
                this.error(`Firmware file for version ${args.ver} not found, download first.`);
            } else {
                this.error(`${error}`);
            }
        }

        if (!verify_firmware(signature_install, firmware_install)) {
            this.error(`Firmware signature invalid for version ${args.ver}, refusing to install.`);
        }

        this.ryder_serial.close();
        const esptool = spawn("esptool.py", [
            "-p",
            flags.ryder_port,
            "write_flash",
            "0x010000",
            unzipped_file,
        ]);
        esptool.on("error", (error: Error) => {
            if (error.name === "ENOENT") {
                this.log("esptool.py not found in PATH. Is it installed? (pip install esptool)");
            }
        });
        esptool.stdout.on("data", message => this.log(message.toString()));
        esptool.stderr.on("data", message => this.error(message.toString()));
        //fs.rmdir(unzipped_path);
    }
}
