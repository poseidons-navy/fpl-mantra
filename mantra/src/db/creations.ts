import db from "./connection";
import { accounts, leagues, league_members } from "./schema";
/**
 *
 * @param manager_id
 * @param email
 * @param wallet_address
 */
export async function createAccounts(
  manager_id: number,
  email: string,
  wallet_address: string
) {
  try {
    const newAccount = await db
      .insert(accounts)
      .values([{ manager_id, email, wallet_address }])
      .execute();
  } catch (err) {
    console.log(err);

    throw new Error(err);
  }
}
/**
 *
 * @param name
 * @param league_id
 * @param events_included
 */
export async function createLeague(
  name: string,
  league_id: number,
  events_included: number
) {
  try {
    const newLeague = await db
      .insert(leagues)
      .values([{ name, league_id, events_included }])
      .execute();
  } catch (err) {
    console.log(err);

    throw new Error(err);
  }
}

/**
 *
 * @param league_id
 * @param member_id
 */
export async function joinLeague(league_id: number, member_id: number) {
  try {
    const newLeagueMember = await db
      .insert(league_members)
      .values([{ league_id, member_id }])
      .execute();
      
  } catch (err) {
    console.log(err);

    throw new Error(err);
  }
}
