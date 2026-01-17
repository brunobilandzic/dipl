import { LoginButton, LogoutButton } from "@/components/auth/login";
import React from "react";
import { getServerSession } from "next-auth";
import { SignUpButton } from "@/components/auth/signup";

async function AuthorizePage() {
  const session = await getServerSession();
  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        {session ? (
          <div>
            <h2 className="text-2xl mb-4 m-x-auto">
              You are logged in as{" "}
              <div className="break-words text-wrap row">
                {JSON.stringify(session, null, 2)}
              </div>
            </h2>

            <p>Welcome back! You have successfully authorized.</p>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-2">
            <LoginButton />
            <SignUpButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorizePage;
