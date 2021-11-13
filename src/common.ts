import { flags } from "@oclif/command";
import { IOptionFlag } from "@oclif/command/lib/flags";
import { validateStacksAddress } from "@stacks/transactions";
import { StacksNetwork, StacksMainnet, StacksTestnet, StacksMocknet } from "@stacks/network";

export function principalFlag(options: Partial<IOptionFlag<string>>) {
	return flags.string({
		...options,
		parse: (input: string, context: any) => {
			if (!validateStacksAddress(input))
				throw new Error(`${input} is not a valid principal.`);
			return options.parse ? options.parse(input, context) : input;
		}
	});
}

export const networkFlag = () => flags.enum({ required: true, options: ["mainnet", "testnet", "mocknet"] });

export function networkFromString(network: string): StacksNetwork { // "mainnet" | "testnet" | "mocknet"
	switch (network) {
		case "mainnet": return new StacksMainnet();
		default:
		case "testnet": return new StacksTestnet();
		case "mocknet": return new StacksMocknet();
	}
}