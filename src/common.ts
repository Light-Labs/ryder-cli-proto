import { flags } from "@oclif/command";
import { IOptionFlag } from "@oclif/command/lib/flags";
import { contractPrincipalCV, standardPrincipalCV, validateStacksAddress } from "@stacks/transactions";
import { StacksNetwork, StacksMainnet, StacksTestnet, StacksMocknet } from "@stacks/network";

export function principalFlag(options: Partial<IOptionFlag<string>>) {
	return flags.string({
		...options,
		parse: (input: string, context: any) => {
			const [address, contract] = input.split('.');
			if (!validateStacksAddress(address))
				throw new Error(`${input} is not a valid principal.`);
			if (typeof contract !== 'undefined' && !/^[a-zA-Z]([a-zA-Z0-9]|[-_])*$/.test(contract))
				throw new Error(`${input} has an invalid contract name`);
			return options.parse ? options.parse(input, context) : input;
		}
	});
}

export const principalCVFromAddress = (address: string) => {
	const index = address.indexOf('.');
	return index === -1 ? standardPrincipalCV(address) : contractPrincipalCV(address.substring(0, index), address.substring(index + 1));
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