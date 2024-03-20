import { createLeague } from "@/db/creations";

export async function POST(request: Request) {
  const league_details = await request.json();
  const { name, league_id, events_included } = league_details;
  try {
    const response = await createLeague(name, league_id, events_included);
    return new Response(JSON.stringify({ message: response }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
