import * as web3 from "@solana/web3.js";
import { PROGRAM_ID } from "./program_id";
/**
 *
 * @PublicKey pda_account
 * @PublcKey senders_account
 * @number amount
 * @returns The transaction object to be signed with SendTransaction.
 */
export async function sendSol(
  league_name: string,
  senders_account: web3.PublicKey,
  amount: number
): Promise<web3.TransactionInstruction> {
  console.log("we in this function");
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [ Buffer.from("leagues"), Buffer.from(league_name)],
    new web3.PublicKey(PROGRAM_ID)
  );
  console.log("Generated PDA");
  const transaction = new web3.TransactionInstruction(
    web3.SystemProgram.transfer({
      fromPubkey: senders_account,
      toPubkey: pda,
      lamports: amount*1000000000,
    })
  );
  return transaction;
}
