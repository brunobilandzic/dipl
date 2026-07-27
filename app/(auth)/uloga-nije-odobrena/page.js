import React from "react";
import { redirect } from "next/navigation";
import { HomeButton } from "@/components/auth/auth";

const RoleRequestNotAllowed = () => {
  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="flex justify-center pt-6 text-5xl underline font-bold">
        ZABRANA PRISTUPA
      </div>
      <div className="text-center text-lg max-w-md">
        Vaš zahtjev za ulogu još nije odobren. Molimo pričekajte ili
        kontaktirajte podršku.
      </div>
      <div>
        <HomeButton />
      </div>
    </div>
  );
};

export default RoleRequestNotAllowed;
