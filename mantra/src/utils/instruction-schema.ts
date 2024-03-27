import * as borsh from "@coral-xyz/borsh";

const instruction_schema = borsh.struct([
 borsh.u8("variant"),
 borsh.str("league_id"),
 borsh.str("creator_id"),
 borsh.str("league_name"),
 borsh.u8("events_included"),
 borsh.str("user_id"),
 borsh.str("manager_id"),
 borsh.u64("entry_fee"),
 borsh.str("name")
]);

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
  var buffer = Buffer.alloc(1000);
  instruction_schema.encode({
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
  return buffer
}
