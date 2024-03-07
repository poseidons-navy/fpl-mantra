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
export const programId = new PublicKey("CghH1z52oAGqLNoKhufggQpXd6NNXTVhxmYbmWY7gvYD");
let [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("accounts")],
    programId
);
export const accountPDAPubKey = pda;
export const connection = new Connection("http://127.0.0.1:8899");