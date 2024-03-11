import {
    SystemProgram,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import { loadKeyPairFromFile, programId, connection, getAccountPubKey } from "./helpers";
import { createAccountSchema } from "./structs";

async function test() {
    try {
        // Get the wallet for local testing
        const payer = loadKeyPairFromFile(process.env.WALLET_PATH);
        const user_id = "1";
        const manager_id = "2";

        // Instruction data
        const buffer = Buffer.alloc(1000);
        createAccountSchema.encode({
            variant: 1, 
            user_id, 
            manager_id,
            league_id: "",
            creator_id: "",
            events_included: 0,
            league_name: "",
        }, buffer);
        const instructionBuffer = buffer.slice(0, createAccountSchema.getSpan(buffer));

        const accountPDAPubKey = getAccountPubKey(user_id, manager_id)[0];

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
                    }, {
                        isSigner: false,
                        isWritable: true,
                        pubkey: SystemProgram.programId
                    }],
                programId: programId,
                data: instructionBuffer
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