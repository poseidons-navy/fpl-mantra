import * as web3 from "@solana/web3.js";
import * as borsh from "@project-serum/borsh";
export const  borshInstructionschema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("league_id"),
    borsh.str("league_name"),
    // borsh.vec(borsh.str(), "league_members"),
    borsh.str("creator_id"),
    borsh.u8("events_included"),
    borsh.str("user_id"),
    borsh.str("manager_id"),
    // borsh.u64("entry_fee"),
    borsh.str("name"),
  ]);
interface Leagueargs {
  league_id?: string;
  league_name?: string;
  league_members?: string[];
  creator_id?: string;
  // events_included?: number;
  user_id?: string;
  manager_id?: string;
  // entry_fee?: number;
  name?: string;
}
export class League {
  league_id: string;
  league_name: string;
  league_members: string[];
  creator_id: string;
  // events_included: number;
  user_id: string;
  manager_id: string;
  // entry_fee: number;
  name: string;

  constructor(fields: Leagueargs) {
    this.league_id = fields.league_id ?? "";
    this.league_name = fields.league_name ?? "";
    this.league_members = fields.league_members ?? [];
    this.creator_id = fields.creator_id ?? "";
    // this.events_included = fields.events_included ?? 0;
    this.user_id = fields.user_id ?? "";
    this.manager_id = fields.manager_id ?? "";
    // this.entry_fee = fields.entry_fee ?? 0.0;
    this.name = fields.name ?? "";
  }
  borshInstructionschema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("league_id"),
     borsh.str("creator_id"),
    borsh.str("league_name"),
   
   
    borsh.u8("events_included"),
    borsh.str("user_id"),
    borsh.str("manager_id"),
    borsh.u64("entry_fee"),
    borsh.str("name"),
  ]);

}

export async function handleCreateLeagueOnchain(
  buffer: Buffer,
  publicKey: web3.PublicKey,
  league_id: string
): Promise<web3.Transaction> {
  const PROGRAM_ID = "Ad3xqSchmppKHSKgx3LKc6qASxJvxarTDsEojwwckSmh";
 
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
  transaction.add(instruction);
  return transaction;
}
