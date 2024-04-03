import { createLeague } from "@/db/creations";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  console.log("Create league hit");
  const league_details = await request.json();
  const {
    name,
    league_id,
    description,
    teams,
    price,
    events_included,
    joining_data,
  } = league_details;
  try {
    const response = await createLeague(
      name,
      league_id,
      description,
      teams,
      price,
      events_included,
      joining_data
    );
    return NextResponse.json(
      {
        message: "Successfully joined the league",
      },
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
