import * as web3 from "@solana/web3.js";
import * as borsh from "@project-serum/borsh";
export const borshInstructionschema = borsh.struct([
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

export async function handleCreateLeagueOnchain(
  buffer: Buffer,
  publicKey: web3.PublicKey,
  league_id: string
): Promise<web3.TransactionInstruction> {
  const PROGRAM_ID = "9SfnmEHEFzTqGj7yzf1Zwzb6EqAWa3ViXNt1xmV3Szt5";

  if (!publicKey) {
    throw new Error("Wallet not connected");
  }
  console.log("Tried pda");
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("leagues"), Buffer.from(league_id)],
    new web3.PublicKey(PROGRAM_ID)
  );
  console.log("pda generated");

  console.log("Buffer generated");
  const transaction = new web3.Transaction();
  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,

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
  return instruction;
}
