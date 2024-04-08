import * as web3 from "@solana/web3.js";

export default async function returnSendSolInstruction(
  receivers_account: web3.PublicKey,
  senders_account: web3.PublicKey,
  amount: number
): Promise<web3.TransactionInstruction> {
  const transaction = new web3.TransactionInstruction(
    web3.SystemProgram.transfer({
      fromPubkey: senders_account,
      toPubkey: receivers_account,
      lamports: amount*1000000000,
    })
  );
  return transaction;
}
