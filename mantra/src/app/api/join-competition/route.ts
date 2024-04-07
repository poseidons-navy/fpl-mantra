import {joinCompetition} from '@/db/creations';

export async function POST(request: Request) {
  console.log("Join competition hit");
  const competition_details = await request.json();
  console.log(competition_details);
  const {
    competition_id,
    member_id,
  } = competition_details;
  try {
    await joinCompetition(competition_id, member_id);
    return new Response(JSON.stringify({ message: "Community Created" }), { status: 201 });
  } catch (e) {
    console.log(e, "Error At Create Account Route");
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
