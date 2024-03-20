import * as web3 from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";
class League {
  league_id: string;
  league_name: string;
  is_initialized: boolean;
  is_created: boolean;
  league_members: string[];
  creator_id: string;
  events_included: number;

  constructor(
    league_id: string,
    league_name: string,
    is_initialized: boolean,
    is_created: boolean,
    league_members: string[],
    creator_id: string,
    events_included: number
  ) {
    this.league_id = league_id;
    this.league_name = league_name;
    this.is_initialized = is_initialized;
    this.is_created = is_created;
    this.league_members = league_members;
    this.creator_id = creator_id;
    this.events_included = events_included;
  }
  borshInstructionschema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("league_id"),
    borsh.str("league_name"),
    borsh.bool("is_initialized"),
    borsh.bool("is_created"),
    borsh.vec(borsh.str(), "league_members"),
    borsh.str("creator_id"),
    borsh.u8("events_included"),
  ]);
  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);

    this.borshInstructionschema.encode({ ...this, variant: 0 }, buffer);

    return buffer.subarray(0, this.borshInstructionschema.getSpan(buffer));
  }
}

export async function handleCreateLeagueOnchain(
  league: League,
  publicKey: web3.PublicKey,
  connection: web3.Connection
): Promise<web3.Transaction> {
  const PROGRAM_ID = "G2abatzkAR2WrDSyABpDVb28Dkk2zxELyaP5jEtmXg35";
  if (!publicKey) {
    throw new Error("Wallet not connected");
  }
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("leagues"), Buffer.from(league.league_id)],
    new web3.PublicKey(PROGRAM_ID)
  );
  const buffer = league.serialize();
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
export async function handleCreateLeagueFpl(
  has_cup: boolean,
  start_event: number,
  league_name: string
) {
  const url = "https://fantasy.premierleague.com/api/leagues-classic/";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        has_cup: has_cup,
        start_event: start_event,
        league_name: league_name,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
}
