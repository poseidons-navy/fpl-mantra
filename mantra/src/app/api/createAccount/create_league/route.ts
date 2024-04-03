import { createLeague } from "@/db/creations";

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
    return new Response(JSON.stringify({ message: response }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
