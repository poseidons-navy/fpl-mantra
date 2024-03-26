import * as web3 from '@solana/web3.js';
import * as borsh from '@coral-xyz/borsh';

import { League } from './create_league';
export async function joinLeague(league: League, publicKey: web3.PublicKey): Promise<web3.Transaction> {
  const PROGRAM_ID = 'G2abatzkAR2WrDSyABpDVb28Dkk2zxELyaP5jEtmXg35';
  if (!publicKey) {
    throw new Error('Wallet not connected');
  }
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('leagues'), Buffer.from(league.league_id)],
    new web3.PublicKey(PROGRAM_ID)
  );
  const buffer = league.serialize();
  const transaction = new web3.Transaction();
  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
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
      }
    ],
    data: buffer,
    programId: new web3.PublicKey(PROGRAM_ID),
   
  });
  transaction.add(instruction);
  return transaction;

}