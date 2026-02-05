import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
export async function fetchSessionAppUser() {
  const email = await fetchSessionEmail();
  if (!email) {
    return null;
  }
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (!appUser) {
    console.log("Failed to fetch app user for session with email:", email);
    return null;
  }
  return appUser;
}

async function fetchSessionEmail() {
  const session = await auth();
  if (!session) {
    console.log("No session found: fetch email failed");
    return null;
  }
  return session.user.email;
}

