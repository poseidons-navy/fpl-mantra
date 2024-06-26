import { joinLeague } from "@/db/creations";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  console.log("Join league hit");
  const league_details = await request.json();
  const { league_id, member_id } = league_details;
  try {
    console.log("league_id", league_id);
    const response = await joinLeague(league_id, member_id);
    return NextResponse.json(
      { message: "Successfully joined the league" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
