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
export async function getPublicKey(manager_id: string) {
  try {
    const manager = doc(db, "managers", manager_id);
    const managerData = await getDoc(manager);
    console.log(managerData.data());
    return managerData.data();
  } catch (error: any) {
    throw new Error(error);
  }
}
