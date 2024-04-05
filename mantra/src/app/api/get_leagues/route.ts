import axios from "axios";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    console.log("Enpoint hit");
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/leagues-classic/2431113/standings/",
      {}
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error occured" },
      { status: 500 }
    );
  }
}
