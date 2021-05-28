import { flags } from "@oclif/command";
import RyderCommand from "../base";
import RyderSerial from "ryderserial-proto";
import fs_default from "fs";
import crypto from "crypto";
import fetch from "node-fetch";
import path from "path";
import { spawn } from "child_process";
import os from "os";

const fs = fs_default.promises;
const firmware_dn = "https://ryder-proto-v2.ryder.id/pioneer";
const firmware_dn_public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA27KCV0QSvgGQ15dvt41W
DlGycy1llBAml/ERdnFnA7BUKT1jwO+9DOkq0QQuj+3MBCdJCaMCpJDOnWf/sYqr
2Tbn9F2vKEVSQ4Xz3GZcJ7ySnPFJT1SVqE61ACWah8+J6NifN0CQneAF9g2SVCO5
SrUYboJJuG9GSvYoldw4VTrortD/isWHSPZM2FuXt+BR1Xtyl7r3yXS50ynFf/KT
Kg9h7zB+wPJ0aMk48/Ufks0HAb832rfubHuWmXW8ck4/PN4QjHa6RXlvCazdPkzU
pAOuXfmTxAQ3CriX4RwxywrxsMhqKvm9/rvaa2tURf29oUrnnFL7M76eWua6FFgL
EwIDAQAB
-----END PUBLIC KEY-----
`;

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
    return verifier.verify(firmware_dn_public_key, signature, "hex");
}

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

    async run() {
        const { args, flags } = this.parse(Firmware);

        if (
            args.action === "install" ||
            (args.action === "download" && /^[0-9]+\.[0-9]+\.[0-9]+$/.test(args.ver))
        ) {
            this.error(new Error("Version should be in the format X.Y.Z"), { exit: 1 });
        }

        await fs.mkdir(ryder_firmware_directory, { recursive: true });

        if (!this.ryder_serial) {
            return;
        }

        switch (args.action) {
            case "fetch":
                this.log("Fetching latest firmware versions");
                const result = await fetch(firmware_dn + "/versions.json");
                const json = await result.json();
                this.log(Object.keys(json).join("\n"));
                await fs.writeFile(versions_file, JSON.stringify(json), "utf8");
                break;

            case "list":
                const response = await this.ryder_serial.send(RyderSerial.COMMAND_INFO);
                const info = typeof response === "number" ? response.toString() : response;
                const current_version = `${info.charCodeAt(5)}.${info.charCodeAt(
                    6
                )}.${info.charCodeAt(7)}`;
                const versions_list = await get_versions();
                if (!versions_list) {
                    this.log("No local firmware versions found, fetch first.");
                } else {
                    this.log(
                        Object.keys(versions_list)
                            .map(v => (v === current_version ? v + " (currently installed)" : v))
                            .join("\n")
                    );
                }
                break;

            case "download":
                const versions_download = await get_versions();

                if (!versions_download || !versions_download[args.ver]) {
                    this.log("Unknown version. (Fetch?)");
                    break;
                }

                const file = versions_download[args.ver].file;
                const signature = versions_download[args.ver].signature;
                this.log(`Downloading ${file}`);
                const result_download = await fetch(firmware_dn + "/" + file);
                const firmware = await result_download.buffer();
                if (verify_firmware(signature, firmware)) {
                    await fs.writeFile(path.join(ryder_firmware_directory, file), firmware);
                } else {
                    this.log(
                        `Firmware signature invalid for version ${args.ver}, download failed.`
                    );
                }
                break;

            case "install":
                const versions_install = await get_versions();
                if (!versions_install || !versions_install[args.ver]) {
                    this.log("Unknown version. (Fetch?)");
                    break;
                }
                const file_path = path.join(
                    ryder_firmware_directory,
                    versions_install[args.ver].file
                );
                const signature_install = versions_install[args.ver].signature;
                let firmware_install;
                try {
                    firmware_install = await fs.readFile(file_path);
                } catch (error) {
                    if (error.code === "ENOENT") {
                        this.error(
                            `Firmware file for version ${args.ver} not found, download first.`
                        );
                    } else {
                        this.error(error);
                    }
                    break;
                }

                if (!verify_firmware(signature_install, firmware_install)) {
                    this.log(
                        `Firmware signature invalid for version ${args.ver}, refusing to install.`
                    );
                    break;
                }
                this.ryder_serial.close();
                const esptool = spawn("esptool.py", [
                    "-p",
                    flags.ryder_port,
                    "write_flash",
                    "0x010000",
                    file_path,
                ]);
                esptool.on("error", (error: Error) => {
                    if (error.name === "ENOENT") {
                        this.log(
                            "esptool.py not found in PATH. Is it installed? (pip install esptool)"
                        );
                    }
                });
                esptool.stdout.on("data", message => this.log(message.toString()));
                esptool.stderr.on("data", message => this.error(message.toString()));
                break;
        }

        this.ryder_serial.close();
    }
}
