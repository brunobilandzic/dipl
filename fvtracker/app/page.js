"use client";

import { UnathorizedHomepage } from "@/components/home/unauthorized";
import { LoadingFullScreen } from "@/components/layout/loading";
import { useSession } from "next-auth/react";
import ProfilePage from "./(auth)/profil/page";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <LoadingFullScreen />;
  }

  if (status == "authenticated") return <ProfilePage />;

  return (
    <>
      <div>
        <UnathorizedHomepage />
      </div>
    </>
  );
}
