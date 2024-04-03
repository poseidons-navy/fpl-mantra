import Account from '@/utils/account';

export async function POST(request: Request) {
  console.log("Create account hit");
  const account_details = await request.json();
  const {
    manager_id,
    email,
    publicKey
  } = account_details;
  try {
    let account = new Account();
    await account.createAccount(publicKey, email, manager_id)
    return new Response(JSON.stringify({ message: "Created Account" }), { status: 201 });
  } catch (e) {
    console.log(e, "Error At Create Account Route");
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
