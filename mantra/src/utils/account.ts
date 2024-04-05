import {createAccounts} from "@/db/creations";
import { encodeInstruction } from "./instruction-schema";
import {PublicKey, Transaction, TransactionInstruction, SystemProgram} from "@solana/web3.js";
import "dotenv/config";

export interface account {
  user_id: string,
  manager_id: string
}

export default class FPLMantraAccount {
  PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID ?? "");
  constructor() {}

  private serializeAccountCreate(user_id: string, manager_id: string): Buffer {
    try {
      return encodeInstruction(1, "", "", "", 0, user_id, manager_id, 0, "");
    } catch(err) {
      console.log(err, "Could Not Serialize Create Account Instruction");
      throw new Error("Could Not Serialize Create Account Instruction");
    }
  }

  private getAccountPDA(user_id: string, manager_id: string): [PublicKey, number] {
    try {
      const [pda, seed] = PublicKey.findProgramAddressSync(
        [Buffer.from("accounts"), Buffer.from(user_id), Buffer.from(manager_id)], 
        this.PROGRAM_ID
      );

      return [pda, seed];
    } catch(err) {
      console.log("Could Not Get PDA", err);
      throw new Error("Could Not Get Account PDA");
    }
  }

  private async createAccountOnChain(publicKey: PublicKey, user_id: string, manager_id: string): Promise<Transaction> {
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      const [pda] = this.getAccountPDA(user_id, manager_id);
      console.log("Account PDA Gotten");
      const instructionBuffer = this.serializeAccountCreate(user_id, manager_id);
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

  async createAccount(email: string, manager_id: string) {
    try {
      // Create in DB
      const user_id = await createAccounts(manager_id, email);
      console.log("Account Created In DB");

      // Create onchain
      // return await this.createAccountOnChain(publicKey, user_id, manager_id);
    } catch(err) {
      console.log("Could Not Create Account", err);
      throw new Error("Could Not Create Account");
    }
  }
}

