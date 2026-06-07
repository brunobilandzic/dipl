import Link from "next/link";

export function UnathorizedPage({ message, path = "/autorizacija" }) {
  return (
    <div className="flex flex-col items-center justify-start h-screen gap-4">
      <h1 className="text-2xl font-bold">Nedovoljno ovlasti</h1>
      <p>{message || "Nemate pristup ovoj stranici."}</p>
      <Link href={path} className=" btn submitButton">
        Povratak na autorizaciju
      </Link>
    </div>
  );
}
