import axios from "axios";
export async function GET() {
  try {
    console.log("Enpoint hit");
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/leagues-classic/2431113/standings/",
      {}
    );
    console.log(response);
  } catch (e) {
    console.log("error: ", e);
  }
}
