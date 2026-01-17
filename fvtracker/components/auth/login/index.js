"use client"

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
      className="btn p-4 cursor-pointer bg-blue-500 text-white rounded"
      onClick={() => {
        signIn();
      }}
    >
      Sign In
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      className="btn p-4 cursor-pointer bg-red-500 text-white rounded"
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
}
