import * as borsh from '@coral-xyz/borsh';

// Define schemas
export const createAccountSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("user_id"),
    borsh.str("manager_id"),
    borsh.str("league_id"),
    borsh.str("creator_id"),
    borsh.u8("events_included"),
    borsh.str("league_name")
]);