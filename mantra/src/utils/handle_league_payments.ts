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
): Promise<web3.Transaction> {
  const [pda, bump_seed] = web3.PublicKey.findProgramAddressSync([Buffer.from("jackpot_account"), Buffer.from(league_name)], new web3.PublicKey("Ad3xqSchmppKHSKgx3LKc6qASxJvxarTDsEojwwckSmh"));
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: senders_account,
      toPubkey: pda,
      lamports: amount,
    })
  );
  return transaction;
  
}
