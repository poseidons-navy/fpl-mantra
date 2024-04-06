import {createCompetitionInDB} from '@/db/creations';

export async function POST(request: Request) {
  console.log("Create competition hit");
  const competition_details = await request.json();
  console.log(competition_details);
  const {
    name,
    league_id,
    creator_id,
    entry_fee
  } = competition_details;
  try {
    await createCompetitionInDB(name, league_id, creator_id, entry_fee);
    return new Response(JSON.stringify({ message: "Community Created" }), { status: 201 });
  } catch (e) {
    console.log(e, "Error At Create Account Route");
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
