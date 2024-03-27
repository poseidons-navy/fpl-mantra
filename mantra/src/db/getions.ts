import { db } from "./creations";
import { doc, getDoc } from "firebase/firestore";
//HINT: If error occurs remember to check league_id that is changed to string from nuber
/**
 * @param league_id
 */
export async function getAllLeagueMembers(league_id: string) {
  try {
    const league = doc(db, "league_members", league_id);
    const league_members = await getDoc(league);
    console.log(league_members.data());
    return league_members.data();
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getLeagues() {
  try {
    const leagues = doc(db, "leagues");
    const league = await getDoc(leagues);
    return league.data();
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCompetitionsFromDB() {
  try {

  } catch(e: any) {
    console.log("Could Not Get Competitions", e);
    throw new Error("Could Not Get Competitions From DB");
  }
}
