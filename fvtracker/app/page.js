"use client";

import { UnathorizedHomepage } from "@/components/home/unauthorized";
import { LoadingFullScreen } from "@/components/layout/loading";
import { useSession } from "next-auth/react";
import ProfileComponent from "@/components/auth/profile";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <LoadingFullScreen />;
  }

  if (status == "authenticated") return <ProfileComponent />;

  return (
    <>
      <div>
        <div className="w-full text-center mb-6 font-bold text-xl">
          Ddajte proizvode u košaricu
        </div>
        <UnathorizedHomepage />
      </div>
    </>
  );
}
