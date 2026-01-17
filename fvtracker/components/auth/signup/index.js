"use client";

import React from "react";
import SignUpForm from "./form";

function SignUpPageComponent() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}

export default SignUpPageComponent;

import Link from "next/link";

export function SignUpButton() {
  return (
    <Link href="/signup">
      <div className="btn p-4 cursor-pointer bg-green-500 text-white rounded">
        Sign up
      </div>
    </Link>
  );
}
