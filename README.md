# Ryder CLI Prototype

[![npm version](https://img.shields.io/npm/v/@lightlabs/ryder-cli-proto.svg?style=flat)](https://www.npmjs.com/package/@lightlabs/ryder-cli-proto)

A basic command-line interface to manage Ryder prototype devices. It can be used to setup & restore, upgrade & downgrade firmware, and to export identities, app keys, and owner keys from Ryder devices. The code is also a good reference to see how the [ryder-serial](https://github.com/Light-Labs/ryderserial-proto) works.

<!-- toc -->
* [Ryder CLI Prototype](#ryder-cli-prototype)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
* [Firmware](#firmware)
* [Contributing](#contributing)
<!-- tocstop -->
* [Ryder CLI Prototype](#ryder-cli-prototype)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
* [Firmware](#firmware)
* [Contributing](#contributing)
<!-- tocstop -->

# Install

Directly:

```bash
npm install -g @lightlabs/ryder-cli-proto
```

Or from a cloned repository:

```bash
cd ryder-cli-proto
npm install -g .
```

Uninstall:

```bash
npm uninstall -g ryder-cli-proto
```

# Usage

<!-- usage -->
```sh-session
$ npm install -g @lightlabs/ryder-cli-proto
$ ryder-cli-proto COMMAND
running command...
$ ryder-cli-proto (-v|--version|version)
@lightlabs/ryder-cli-proto/0.0.4 win32-x64 node-v16.14.0
$ ryder-cli-proto --help [COMMAND]
USAGE
  $ ryder-cli-proto COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g @lightlabs/ryder-cli-proto
$ ryder-cli-proto COMMAND
running command...
$ ryder-cli-proto (-v|--version|version)
@lightlabs/ryder-cli-proto/0.0.4 darwin-arm64 node-v15.3.0
$ ryder-cli-proto --help [COMMAND]
USAGE
  $ ryder-cli-proto COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ryder-cli-proto help [COMMAND]`](#ryder-cli-proto-help-command)

## `ryder-cli-proto help [COMMAND]`

display help for ryder-cli-proto

```
USAGE
  $ ryder-cli-proto help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_
<!-- commandsstop -->
* [`ryder-cli-proto erase`](#ryder-cli-proto-erase)
* [`ryder-cli-proto export WHAT ID_NUMBER [APP_DOMAIN]`](#ryder-cli-proto-export-what-id_number-app_domain)
* [`ryder-cli-proto firmware ACTION [VER]`](#ryder-cli-proto-firmware-action-ver)
* [`ryder-cli-proto help [COMMAND]`](#ryder-cli-proto-help-command)
* [`ryder-cli-proto info`](#ryder-cli-proto-info)
* [`ryder-cli-proto restore`](#ryder-cli-proto-restore)
* [`ryder-cli-proto send-stx`](#ryder-cli-proto-send-stx)
* [`ryder-cli-proto setup`](#ryder-cli-proto-setup)
* [`ryder-cli-proto wake`](#ryder-cli-proto-wake)

## `ryder-cli-proto erase`

Erase a Ryder.

```
USAGE
  $ ryder-cli-proto erase

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
```

_See code: [src/commands/erase.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/erase.ts)_

## `ryder-cli-proto export WHAT ID_NUMBER [APP_DOMAIN]`

Export an identity or key from a Ryder

```
USAGE
  $ ryder-cli-proto export WHAT ID_NUMBER [APP_DOMAIN]

ARGUMENTS
  WHAT        (identity|owner_key|app_key) what to export
  ID_NUMBER   identity number of thing to export
  APP_DOMAIN  Required when exporting an app key

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port    (required) port of ryder device to connect to
  -h, --help                     show CLI help
  -k, --private_key=private_key  Include private key (if available)
```

_See code: [src/commands/export.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/export.ts)_

## `ryder-cli-proto firmware ACTION [VER]`

Manage firmware versions.

```
USAGE
  $ ryder-cli-proto firmware ACTION [VER]

ARGUMENTS
  ACTION  (fetch|download|list|install|version)
  VER     only required on download or install

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
```

_See code: [src/commands/firmware.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/firmware.ts)_

## `ryder-cli-proto help [COMMAND]`

display help for ryder-cli-proto

```
USAGE
  $ ryder-cli-proto help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ryder-cli-proto info`

Read Ryder device information.

```
USAGE
  $ ryder-cli-proto info

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
```

_See code: [src/commands/info.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/info.ts)_

## `ryder-cli-proto restore`

describe the command here

```
USAGE
  $ ryder-cli-proto restore

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
  --mnemonic=12|18|24          12, 18, or 24 word mnemonic seed phrase
  --seed=seed                  seed as a number
```

_See code: [src/commands/restore.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/restore.ts)_

## `ryder-cli-proto send-stx`

Send STX a specified principal.

```
USAGE
  $ ryder-cli-proto send-stx

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port          (required) port of ryder device to connect to
  -h, --help                           show CLI help
  --account=account                    (required) The account number to send from
  --amount=amount                      (required) The amount in mSTX
  --network=(mainnet|testnet|mocknet)  (required)
  --recipient=recipient                (required) The principal to transfer the STX to
```

_See code: [src/commands/send-stx.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/send-stx.ts)_

## `ryder-cli-proto setup`

Initialize a Ryder.

```
USAGE
  $ ryder-cli-proto setup

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
```

_See code: [src/commands/setup.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/setup.ts)_

## `ryder-cli-proto wake`

Wake up the Ryder.

```
USAGE
  $ ryder-cli-proto wake

OPTIONS
  -D, --debug
  -R, --ryder_port=ryder_port  (required) port of ryder device to connect to
  -h, --help                   show CLI help
```

_See code: [src/commands/wake.ts](https://github.com/Light-Labs/ryder-cli-proto/blob/v0.0.4/src/commands/wake.ts)_
<!-- commandsstop -->

# Firmware

Firmware files are downloaded by the CLI and then cached locally. The default cache directory is `~/.ryder/proto-v2/firmware`. The directory can be changed by setting the `RYDER_FIRMWARE_DIRECTORY` environment variable.

You need `esptool.py` to install firmwares. Install it using `pip install esptool`.

To fetch the latest list of available firmwares use:

```bash
ryder-cli-proto firmware fetch
```

Download a firmware version:

```bash
ryder-cli-proto firmware download 0.0.1
```

Install a firmware version:

```bash
ryder-cli-proto firmware install 0.0.1
```

# Contributing

1. Create a branch with the naming convention `first-name/feature-name`.
2. Open a pull request and request a review of a fellow Pioneer.
3. Squash and merge is preferred.
