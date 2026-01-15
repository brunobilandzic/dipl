"use client";
import { signIn } from "next-auth/react";

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
