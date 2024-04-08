import Account from '@/utils/account';
import {PublicKey} from "@solana/web3.js";

export async function POST(request: Request) {
  console.log("Create account hit");
  const account_details = await request.json();
  console.log(account_details);
  const {
    manager_id,
    email,
    publicKey,
    sendTransaction,
    connection
  } = account_details;

  let pubKey = new PublicKey(publicKey);
  try {
    let account = new Account();
    const transaction = await account.createAccount(pubKey.toBase58(), email, manager_id);
    const txID = sendTransaction(transaction, connection);
    console.log(`Transaction sent ${txID}`);
    return new Response(JSON.stringify({ message: "Created Account" }), { status: 201 });
  } catch (e) {
    console.log(e, "Error At Create Account Route");
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
