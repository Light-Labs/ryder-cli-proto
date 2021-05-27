#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();
const ryder_firmware_directory =
    process.env.RYDER_FIRMWARE_DIRECTORY || path.join(homedir, ".ryder/proto-v2/firmware");
fs.rmdirSync(ryder_firmware_directory, { recursive: true });
