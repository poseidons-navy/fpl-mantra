import { Connection, Keypair, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

export function loadKeyPairFromFile(path: string): Keypair {
    try {
        if(!fs.existsSync(path)) {
            throw new Error("File Does Not Exist")
        }

        // Get data from file
        const data = JSON.parse(fs.readFileSync(path, { encoding: "utf-8"}));

        // Converting data to public keys
        const keyPair = Keypair.fromSecretKey(new Uint8Array(data));
        return keyPair;
    } catch(err) {
        console.log("Could Not Get Account From File");
        console.log(err);
    }
}

export function getLeagueJackpotAccountPubKey(league_name: string): [PublicKey, number] {
    let [jackpot, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(league_name), Buffer.from("jackpot_account")],
        programId
    );

    return [jackpot, bump];
}

export const programId = new PublicKey(process.env.SOL_PROGRAM_ID);
let [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("accounts")],
    programId
);
export const accountPDAPubKey = pda;
export const connection = new Connection(process.env.SOL_CONNECTION_URL);