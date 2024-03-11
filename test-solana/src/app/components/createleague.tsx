"use client";
import { FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
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

const CreateLeague: FC = () => {
  console.log("Create league called");
  const PROGRAM_ID = "G2abatzkAR2WrDSyABpDVb28Dkk2zxELyaP5jEtmXg35";
  const { connection } = useConnection();

  const { publicKey, sendTransaction } = useWallet();

  const onButtonClick = (event: any) => {
    console.log("Button clicked");
    event.preventDefault();
    const league = new League("123", "league1", false, false, [], "123", 0);
    console.log("About to run handlesubmitTransaction");
    handlesubmitTransaction(league);
  };
  const handlesubmitTransaction = async (league: League) => {
    console.log("this runs");

    if (!publicKey) {
      return;
    }
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(league.league_id)],
      new web3.PublicKey(PROGRAM_ID)
    );
    console.log("Here comes the Program public key");
    console.log(new web3.PublicKey(PROGRAM_ID));
    console.log(pda.toBase58());
    const buffer = league.serialize();
    console.log(buffer.toString("hex"));
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
    try {
      console.log("Atleast we tried");
      let txid = await sendTransaction(transaction, connection);

      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log("this worked");
    } catch (e) {
      console.log("error occured");
      console.log(JSON.stringify(e));
    }
  };

  return (
    <div className="pt-5 mx-auto">
      <div>Create league</div>
      <button
        className="p-2 border rounded-sm hover:p-3"
        onClick={onButtonClick}
      >
        create
      </button>
    </div>
  );
};
export default CreateLeague;
