import * as web3 from "@solana/web3.js";
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
    new web3.PublicKey("9SfnmEHEFzTqGj7yzf1Zwzb6EqAWa3ViXNt1xmV3Szt5")
  );
  console.log("Generated PDA");
  const transaction = new web3.TransactionInstruction(
    web3.SystemProgram.transfer({
      fromPubkey: senders_account,
      toPubkey: pda,
      lamports: amount,
    })
  );
  return transaction;
}
