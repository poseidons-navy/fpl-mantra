import { getLeagueJackpotAccountPubKey, loadKeyPairFromFile, programId } from "./helpers";
import dotenv from 'dotenv';
import { createAccountSchema } from "./structs";
import { SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
dotenv.config();

async function test() {
    try {
        // Get wallet for someone who wants to create league jackpot
        const league_name = "Test League";
        const league_jackpot_account = getLeagueJackpotAccountPubKey(league_name)[0];
        const payer = loadKeyPairFromFile(process.env.WALLET_PATH);

        // Make transaction
        
        // Instruction data
        const buffer = Buffer.alloc(1000);
        createAccountSchema.encode({
            variant: 2,
            user_id: "",
            manager_id: "",
            league_id: "",
            creator_id: "",
            events_included: 0,
            league_name: league_name,
        }, buffer);
        const instructionBuffer = buffer.slice(0, createAccountSchema.getSpan(buffer))
        
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
                        pubkey: league_jackpot_account,
                    }, {
                        isSigner: false,
                        isWritable: false,
                        pubkey: SystemProgram.programId
                    }],
                programId: programId,
                data: instructionBuffer
            })
        )
        // Send transaction
    } catch(err) {
        console.log("OHH SHIT! Something ain't right");
        console.log(err);
    }
}

test();