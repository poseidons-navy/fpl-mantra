import {
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import { loadKeyPairFromFile, programId, connection, accountPDAPubKey } from "./helpers";

async function test() {
    try {
        // Get the wallet for local testing
        const payer = loadKeyPairFromFile(process.env.WALLET_PATH);

        // Create account transaction
        const transaction = new Transaction();
        transaction.add(
            new TransactionInstruction({
                keys: [
                    {
                        isSigner: true,
                        isWritable: false,
                        pubkey: payer.publicKey
                    }, {
                        isSigner: false,
                        isWritable: true,
                        pubkey: accountPDAPubKey
                    }],
                programId: new PublicKey(programId)
            })
        )

        // Run
        const txHash = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer]
        )
        console.log(`Transaction completed with has ${txHash}`);
    } catch (err) {
        console.log("OOPS! Something ain't right");
        console.log(err);
    }
}

test();