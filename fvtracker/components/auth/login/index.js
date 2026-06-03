"use client";

import React from "react";
import LoginForm from "./form";

function LoginPageComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default LoginPageComponent;

import { signIn, signOut } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      className="btn submitButton"
      onClick={() => {
        signIn();
      }}
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
