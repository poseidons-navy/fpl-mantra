import { createAccounts } from "@/db/creations";
export async function POST(request: Request) {
  const signup_details = await request.json();
  const { manager_id, email, wallet_address } = signup_details;
  try {
    const response = await createAccounts(manager_id, email);
    return new Response(JSON.stringify({ message: response }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
