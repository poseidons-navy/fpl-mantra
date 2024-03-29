import * as web3 from "@solana/web3.js";
/**
 *
 * @PublicKey pda_account
 * @PublcKey senders_account
 * @number amount
 * @returns The transaction object to be signed with SendTransaction.
 */
export async function sendSol(
  pda_account: web3.PublicKey,
  senders_account: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: senders_account,
      toPubkey: pda_account,
      lamports: amount,
    })
  );
  return transaction;
  
}
