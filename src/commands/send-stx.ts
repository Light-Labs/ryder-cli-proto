import { flags } from "@oclif/command";
import RyderSerial from "ryderserial-proto";
import RyderCommand from "../base";
import { principalFlag, networkFlag, networkFromString, principalCVFromAddress } from "../common";
import {
	AnchorMode,
	makeUnsignedSTXTokenTransfer,
	deserializeTransaction,
	PostConditionMode,
	broadcastTransaction,
	UnsignedTokenTransferOptions
} from "@stacks/transactions";

export default class SendStx extends RyderCommand {
	static description = "Send STX to a specified principal.";

	static flags = {
		...RyderCommand.flags,
		help: flags.help({ char: "h" }),
		amount: flags.integer({ description: "The amount in mSTX", required: true }),
		nonce: flags.integer({ description: "The account nonce", required: false }),
		fee: flags.integer({ description: "The fee in mSTX", required: false }),
		memo: flags.string({ description: "Memo", required: false }),
		account: flags.integer({ description: "The account number to send from", required: true }),
		recipient: principalFlag({ description: "The principal to transfer the STX to", required: true }),
		broadcast: flags.enum({ description: "Broadcast the transaction to the network", required: true, options: ["yes", "no"] }),
		network: networkFlag()
	};

	async run() {
		const { flags } = this.parse(SendStx);
		const { amount, account, recipient, network, nonce, fee, memo, broadcast } = flags;
		if (!this.ryder_serial || !recipient) {
			return;
		}
		if (account < 0 || account > 255)
			throw new Error('account should be within 0-255');
		const stacksNetwork = networkFromString(network);
		const options: UnsignedTokenTransferOptions = {
			recipient: principalCVFromAddress(recipient),
			amount,
			anchorMode: AnchorMode.OnChainOnly,
			network: stacksNetwork,
			nonce: nonce || 0,
			postConditionMode: PostConditionMode.Allow,
			publicKey: ''
		};
		if (memo)
			options.memo = memo;
		if (fee)
			options.fee = fee;
		const transaction = await makeUnsignedSTXTokenTransfer(options);

		const command = new Uint8Array(2);
		command[0] = 50; //FIXME use RyderSerial constant
		command[1] = account;
		const response = await this.ryder_serial.send(command);
		if (response === RyderSerial.RESPONSE_SEND_INPUT) {
			const tx_bytes = transaction.serialize();
			console.log('tx length', tx_bytes.byteLength);
			const tx_length = Buffer.from([tx_bytes.byteLength >> 24 & 0xff, tx_bytes.byteLength >> 16 & 0xff, tx_bytes.byteLength >> 8 & 0xff, tx_bytes.byteLength & 0xff]);
			const data = Buffer.concat([tx_length, tx_bytes]);
			const uint8a = new Uint8Array(data.byteLength);
			for (let i = 0; i < data.byteLength; ++i)
				uint8a[i] = data[i];
			const signed: any = await this.ryder_serial.send(uint8a); //TODO use Uint8Array to get around a ryderserial-proto issue.
			if (signed === RyderSerial.RESPONSE_REJECTED) {
				console.log("User cancel");
			}
			else {
				const signed_hex = Buffer.from(signed, 'binary').toString('hex');
				if (broadcast === 'yes') {
					const signedTransaction = deserializeTransaction(signed_hex);
					const txid = await broadcastTransaction(signedTransaction, stacksNetwork);
					console.log(txid);
				}
				else
					console.log(signed_hex);
			}
		}
		this.ryder_serial.close();
	}
}
