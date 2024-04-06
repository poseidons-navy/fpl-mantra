import { db } from "./creations";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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

export async function getLeaguesOfMember(member_id: string){
  try {
    const leagues = doc(db, "league_members", member_id);
    const leagues_snapshot = await getDoc(leagues);
    const leagues_data = leagues_snapshot.data();
    console.log(leagues_data);
    return [];
  } catch(err) {
    console.log(err);
    throw "Could Not Get Leagues Of User"
  }
}

export async function getLeagues() {
  try {
    console.log("The function is called");
    const leaguesCollection = collection(db, "leagues");
    const leaguesSnapshot = await getDocs(leaguesCollection);
    const leagues = leaguesSnapshot.docs.map((doc) => doc.data());
    return leagues;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCompetitionsFromDB() {
  try {
    const competitionCollection = collection(db, "competition");
    const competitionsSnapshot = await getDocs(competitionCollection);
    const competitions = competitionsSnapshot.docs.map((doc) => doc.data());
    return competitions;
  } catch (e: any) {
    console.log("Could Not Get Competitions", e);
    throw new Error("Could Not Get Competitions From DB");
  }
}
