function UnathorizedPage({ message, path = "/autorizacija" }) {
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1 className="text-2xl font-bold">Nedovoljno ovlasti</h1>
    <p>{message || "Nemate pristup ovoj stranici."}</p>
    <Link href={path} className="text-blue-500 hover:underline">
      Povratak na autorizaciju
    </Link>
  </div>;
}
