import {DocumentData} from "firebase/firestore";

export class FirebaseCompetition {
  competition_id: string;
  creator_id: string;
  league_id: string;
  competition_name: string;
  entry_fee: number;

  constructor(creator_id: string, league_id: string, name: string, entry_fee: number, competition_id: string) {
    this.competition_id = competition_id;
    this.creator_id = creator_id;
    this.league_id = league_id;
    this.competition_name = name;
    this.entry_fee = entry_fee;
  }

  static fromFirebase(id: string, data: DocumentData): FirebaseCompetition {
    return new FirebaseCompetition(
      data.creator_id,
      data.league_id,
      data['name'],
      data.entry_fee,
      id
    );
  }
}
