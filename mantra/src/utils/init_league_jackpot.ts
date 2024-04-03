import * as web3 from "@solana/web3.js";
import * as borsh from "@project-serum/borsh";
export const  initInstructionschema = borsh.struct([
  borsh.u8("variant"),
  borsh.str("league_id"),
  borsh.str("league_name"),
  // borsh.vec(borsh.str(), "league_members"),
  borsh.str("creator_id"),
  borsh.u8("events_included"),
  borsh.str("user_id"),
  borsh.str("manager_id"),
  borsh.u8("entry_fee"),
  borsh.str("name"),
]);

export async function init_jackpot_account(
    buffer: Buffer,
  league_name: string,
  publickey: web3.PublicKey
): Promise<web3.TransactionInstruction> {
  const PROGRAM_ID = "9SfnmEHEFzTqGj7yzf1Zwzb6EqAWa3ViXNt1xmV3Szt5";

  if (!publickey) {
    throw new Error("Wallet not connected");
  }
  const [pda, bump_seed] = web3.PublicKey.findProgramAddressSync(
    [ Buffer.from(league_name), Buffer.from("jackpot_account")],
    new web3.PublicKey("9SfnmEHEFzTqGj7yzf1Zwzb6EqAWa3ViXNt1xmV3Szt5")
  );
    const transaction = new web3.TransactionInstruction({
        keys: [
        {
            pubkey: publickey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: pda,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        ],
        data: buffer,
        programId: new web3.PublicKey(PROGRAM_ID),
    });
    return transaction;
}
