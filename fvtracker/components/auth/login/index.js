"use client";

import React from "react";
import { signIn, signOut } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      className="btn submitButton"
      onClick={() => signIn(undefined, { callbackUrl: "/profil" })}
    >
      Prijava
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      className="btn cancelButton"
      onClick={() => {
        signOut();
      }}
    >
      Odjava
    </button>
  );
}
