import { db } from "./creations";
import { doc, getDoc, collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import "dotenv/config";
import {FirebaseCompetition} from "@/utils/firebase-types";
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

// export async function getLeaguesOfMember(member_id: string): Promise<FirebaseCompetition[]>{
//   try {
//     const q = query(collection(db, "league_members"), where("member_id", "==", member_id));
//     const querySnapshot = await getDocs(q);
//     const member_leagues: FirebaseCompetition[] = [];
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log(doc.id, "=>", doc.data());
//    });
//    return member_leagues;
//   } catch(err) {
//     console.log(err);
//     throw "Could Not Get Leagues Of User"
//   }
// }

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

export async function getCompetitionsFromDB(): Promise<FirebaseCompetition[]> {
  try {
    console.log("Getting Competitions FROM DB");
    const competitionCollection = collection(db, "competition");
    const competitionsSnapshot = await getDocs(competitionCollection);
    const competitions = competitionsSnapshot.docs.map((doc) =>  FirebaseCompetition.fromFirebase(doc.id ,doc.data()));
    console.log(competitions);
    return competitions;
  } catch (e: any) {
    console.log("Could Not Get Competitions", e);
    throw new Error("Could Not Get Competitions From DB");
  }
}
