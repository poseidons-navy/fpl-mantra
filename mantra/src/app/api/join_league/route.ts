import { joinLeague } from "@/db/creations";
export async function POST(request: Request) {
  const league_details = await request.json();
  const { league_id, member_id } = league_details;
  try {
    const response = await joinLeague(league_id, member_id);
    return new Response(JSON.stringify({ message: response }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
