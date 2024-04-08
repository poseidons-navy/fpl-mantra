import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  try {
    console.log("Enpoint hit");
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("leagueId");
    console.log("Got the leagueid",query);
    const response = await axios.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${query}/standings/`,
      {}
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (e) {
    console.log("error occured during fetching leagues", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error occured" },
      { status: 500 }
    );
  }
}
