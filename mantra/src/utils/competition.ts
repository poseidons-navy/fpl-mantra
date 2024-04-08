import { encodeInstruction } from "./instruction-schema";
import {PublicKey, Transaction, TransactionInstruction, SystemProgram} from "@solana/web3.js";
import "dotenv/config";
import FPLMantraAccount from "./account";

export default class FPLMantraCompetition {
  PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID ?? process.env.NEXT_PUBLIC_PROGRAM_ID ?? "5jgsuXBRFenZHWKYKdLFzYZeeFhv2fa7m4YwEZfbtD3U");
  constructor() {}

  private serializeCompetitionCreate(name: string, league_id: string, entry_fee: number, creator_id: string): Buffer {
    try {
      return encodeInstruction(4, league_id, creator_id, "", 0, "", "", entry_fee, name);
    } catch(err) {
      console.log(err, "Could Not Serialize Create Competition Instruction");
      throw new Error("Could Not Serialize Create Competition Instruction");
    }
  }

  getCompetitionPDA(league_id: string, name: string): [PublicKey, number] {
    try {
      const [pda, seed] = PublicKey.findProgramAddressSync(
        [Buffer.from("community"), Buffer.from(league_id), Buffer.from(name)], 
        this.PROGRAM_ID
      );

      return [pda, seed];
    } catch(err) {
      console.log("Could Not Get PDA", err);
      throw new Error("Could Not Get Competition PDA");
    }
  }

  getCompetitionJackpotAccountPDA(name: string, league_id: string): [PublicKey, number] {
    try {
      const [pda, seed] = PublicKey.findProgramAddressSync(
        [Buffer.from(league_id), Buffer.from(name), Buffer.from("community_jackpot")], 
        this.PROGRAM_ID
      );

      return [pda, seed];
    } catch(err) {
      console.log("Error Getting Competition Jackpot");
      throw new Error("Could Not Get Competition Jackpot");
    }
  }

  async createAccountOnChain(publicKey: PublicKey, name: string, league_id: string, entry_fee: number, creator_id: string, manager_id: string): Promise<Transaction> {
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      let creatorAccount = new FPLMantraAccount();
      let competitionJackpotPDA = this.getCompetitionPDA(league_id, name)[0];
      

      const [pda] = this.getCompetitionPDA(league_id, name);
      const [league_PDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("leagues"), Buffer.from(league_id)],
        this.PROGRAM_ID
      );
      console.log("Competition PDA Gotten");
      const instructionBuffer = this.serializeCompetitionCreate(name, league_id, entry_fee, creator_id);
      console.log("Gotten Instruction Buffer");
      const transaction = new Transaction();
      const instruction = new TransactionInstruction({
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
            pubkey: league_PDA,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: competitionJackpotPDA,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: SystemProgram.programId,

            isSigner: false,

            isWritable: false,
          },
        ],
        data: instructionBuffer,
        programId: this.PROGRAM_ID,
      });
      transaction.add(instruction);
      return transaction;
 
    } catch(err) {
      console.log("Could Not Create Account Onchain", err);
      throw new Error("Could Not Create Account Onchain");
    }
  }
}

