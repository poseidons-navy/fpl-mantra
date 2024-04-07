import * as borsh from "@coral-xyz/borsh";
import { borshInstructionschema } from "./create_league";

export function encodeInstruction(
  variant: number,
  league_id: string,
  creator_id: string,
  league_name: string,
  events_included: number,
  user_id: string,
  manager_id: string,
  entry_fee: number,
  name: string
): Buffer {
  var buffer = Buffer.alloc(10000);
  borshInstructionschema.encode({
    variant,
    league_id,
    creator_id,
    league_name,
    events_included,
    user_id,
    manager_id,
    entry_fee,
    name
  }, buffer);
  const instructionBuffer = buffer.subarray(
    0,
    borshInstructionschema.getSpan(buffer)
  );
  return instructionBuffer
}
