import { fetchSessionAppUser } from "@/lib/auth/user/userServer";
import { UNATHENTICATED_ACCESS } from "@/lib/constants/errors/user/appUser";

export async function GET(req) {
  console.log("User redux route GET called");
  try {
    const appUser = await fetchSessionAppUser();
    console.log("Fetched app user in route:", appUser);
    if (!appUser) {
      console.log("anonymous user - no appUser found in session");
      return Response.json(
        {
          message: UNATHENTICATED_ACCESS,
        },
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return Response.json(
      { message: "App user fetched successfully", appUser },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in User redux route GET:", error);
    return Response.json(
      {
        message: "Error fetching app user",
        error,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
