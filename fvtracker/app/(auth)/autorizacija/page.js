"use client";

import { LoginButton, LogoutButton } from "@/components/auth/login";
import React from "react";
import { SignUpButton } from "@/components/auth/signup";
import { useSession } from "next-auth/react";

function AuthorizePage() {
  const { data: session } = useSession();

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        {session != undefined ? (
          <div>
            <h2 className="text-2xl mb-4 m-x-auto">
              Prijavljeni ste kao{" "}
              <div className="break-words text-wrap row">
                {JSON.stringify(session, null, 2)}
              </div>
            </h2>

            <p>Dobrodošli natrag! Uspješno ste autorizirani.</p>
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
