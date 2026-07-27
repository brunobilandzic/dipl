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
    <Link href="/registracija">
      <div className="btn">Registracija</div>
    </Link>
  );
}
