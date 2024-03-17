import axios, { AxiosResponse } from "axios";
const login = async (
  username: string,
  password: string
): Promise<AxiosResponse<any, any>> => {
  const loginUrl = "https://users.premierleague.com/accounts/login/";
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    const response = await axios.post(
      loginUrl,
      {
        login: username,
        password: password,
        app: "plfpl-web",
        redirect_uri: "https://fantasy.premierleague.com/",
      },
      {
        headers: {
          "accept-language": "en",
        },
        validateStatus: (statusCode: number) =>
          statusCode >= 200 && statusCode < 400,
      }
    );
    const cookies = response.headers["set-cookie"];

    const locationHeader: string | undefined = response.headers["location"];

    if (locationHeader && locationHeader.includes("reason=credentials")) {
      throw new Error(`login(${login}): Invalid credentials`);
    } else if (locationHeader && locationHeader.includes("/users/reconfirm")) {
      throw new Error("Team with credentials not created yet");
    } else if (!cookies || cookies.length === 0) {
      throw new Error("No cookies found");
    } else if (locationHeader === "/2fa/login/") {
      throw new Error("2FA required");
    } else {
      return response;
    }
  } catch (e) {
    throw new Error((e as Error).toString());
  }
};
