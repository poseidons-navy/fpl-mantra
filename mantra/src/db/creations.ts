// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "dotenv/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY ?? process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID ?? process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID ?? process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID ?? process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 *
 * @param manager_id
 * @param email
 * @param wallet_address
 */

export async function createAccounts(
  manager_id: string,
  email: string,
//  wallet_address: string
): Promise<string> {
  try {
    console.log("Begining of Create Account");

    const docRef = await addDoc(collection(db, "accounts"), {
      manager_id,
      email,
    });

    console.log("Created Account Offchain")

    return docRef.id;
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
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
  league_id: string,
  description: string,
  teams: number,
  price: number,
  events_included: number,
  joining_data: { join_link: string; join_code: string }
) {
  try {
    await addDoc(collection(db, "leagues"), {
      name,
      league_id,
      description,
      teams,
      price,
      events_included,
      joining_data: {
        join_link: joining_data.join_link,
        join_code: joining_data.join_code,
      },
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

/**
 *
 * @param league_id
 * @param member_id
 */
export async function joinLeague(league_id: number, member_id: number) {
  try {
    await addDoc(collection(db, "league_members"), { league_id, member_id });
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function createCompetitionInDB(
  name: string,
  league_id: string,
  creator_id: string,
  entry_fee: number 
) {
  try {
    await addDoc(collection(db, "competition"), {
     name,
     league_id,
     creator_id,
     entry_fee
    });
  } catch (e: any) {
    console.log(e, "Could Not Add Competition to DB");
    throw new Error("Could Not Add Competition To DB");
  }
}
