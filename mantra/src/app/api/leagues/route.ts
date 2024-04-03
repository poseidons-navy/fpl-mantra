import { getLeagues } from "@/db/getions";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const leagues = await getLeagues();
    return NextResponse.json(leagues, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
