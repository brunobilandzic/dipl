"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LoginForm from "./form";

function LoginPageComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default LoginPageComponent;

export function LoginButton() {
  return (
    <Link href="/login">
      <div className="btn submitButton">Prijava</div>
    </Link>
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
