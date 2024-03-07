import { Connection, Keypair, PublicKey } from '@solana/web3.js';
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
export const accountPDAPubKey = new PublicKey("");
export const programId = "";
export const connection = new Connection("");