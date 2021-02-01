# Ryder Prototype CLI

A basic command-line interface to manage Ryder prototype devices. It can be used to setup & restore, upgrade & downgrade firmware, and to export identities, app keys, and owner keys from Ryder devices. The code is also a good reference to see how `RyderSerial` works.

## Install

Since this is a private repository, [GitHub SSH access](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) has to be enabled on your account.

Directly:

```bash
npm install -g git+https://github.com/Light-Labs/ryder-cli-proto.git
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

## Usage

Print help using `ryder-cli-proto --help`.

```
Commands:
  ryder-cli-proto erase                     Erase a Ryder.
  ryder-cli-proto export <what> <identity   Export an identity or key from a
  number> [app domain]                      Ryder.
  ryder-cli-proto firmware <action> [ver]   Manage firmware versions.
  ryder-cli-proto info                      Read Ryder device information.
  ryder-cli-proto restore                   Restore a Ryder using a mnemonic
                                            phrase. Use --mnemonic to specify
                                            the number of words.
  ryder-cli-proto setup                     Initialise a Ryder.
  ryder-cli-proto wake                      Wake up.

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Firmware

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

## Contributing

1. Create a branch with the naming convention `first-name/feature-name`.
2. Open a pull request and request a review of a fellow Pioneer.
3. Squash and merge is preferred.
