import authLib from "@/lib/auth";
import { UNATHENTICATED_ACCESS } from "@/lib/constants/errors/user/appUser";
import users from "@/lib/users";

export async function GET(req) {
  console.log("User redux route GET called");
  const { searchParams } = new URL(req.url);
  try {
    const appUser = await authLib.session.fetchSessionAppUser();
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

    let manager = null;
    if (searchParams.get("includeManager") === "true") {
      manager = await users.managers.fetchManager(appUser.manager);
    }

    return Response.json(
      {
        message: "App user fetched successfully",
        appUser,
        manager: manager ? manager : null,
      },
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
