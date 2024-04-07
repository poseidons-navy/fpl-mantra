import * as borsh from "@project-serum/borsh";
import * as web3 from "@solana/web3.js";
import {PROGRAM_ID} from "./program_id";
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
export async function handlePaymentsOnchain( buffer: Buffer,
    publicKey: web3.PublicKey,
    league_id: string): Promise<web3.TransactionInstruction>{
    try{
        if (!publicKey) {
            throw new Error("Wallet not connected");
          }
          const [pda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("leagues"), Buffer.from(league_id)],
            new web3.PublicKey(PROGRAM_ID)
          );
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
    catch(e){
        throw new Error((e instanceof Error ? e.message : e) as string);
    }
}