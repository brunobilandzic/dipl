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
        <div className="text-2xl font-bold mb-4">
          Dobrodošli u web trgovinu za proizvode od voća i povrća!
        </div>
        <div className="text-lg">
          Izaberite proizvod i dodajte ga u košaricu. Nakon toga, kliknite na
          košaricu i slijedite upute za dovršetak narudžbe.
        </div>
        <UnathorizedHomepage />
      </div>
    </>
  );
}
