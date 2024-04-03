import axios from "axios";
import { headers } from "next/headers";
interface Logins {
  username: string;
  password: string;
}
export async function POST(request: Request) {
  console.log("endpoint hit");
  let logins = await request.json();
  console.log("Something here");
  const loginUrl = "https://users.premierleague.com/accounts/login/";
  try {
    const response = await axios.post(
      loginUrl,
      {
        username: logins.username,
        password: logins.password,
        app: "plfpl-web",
        redirect_uri: "https://fantasy.premierleague.com/",
      },
      {
        headers: {
          "accept-language": "en",
          "Content-Type": "application/json",
        },
        validateStatus: (statusCode: number) =>
          statusCode >= 200 && statusCode < 400,
        maxRedirects: 0,
      }
    );
    console.log("response");
    return new Response(JSON.stringify({ message: response }), { status: 200 });
  } catch (e: any) {
    console.log("Error occured");
    console.log(e);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
