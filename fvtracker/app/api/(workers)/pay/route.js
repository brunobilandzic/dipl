import { fetchManager } from "@/lib/auth/fetchSessionData";

export async function POST(req) {
  try {
    const { managerType, workerId, amount } = await req.json();
    console.log(
      `Received payment request for worker ${workerId} of type ${managerType} with amount ${amount}`,
    );
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({ managerNames: [managerType] });
    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Nemate pravo isplatiti radnika" },
        { status: 401 },
      );
    }
    await Worker.findByIdAndUpdate(workerId, {
      $inc: { payedAmount: amount },
    });
    return Response.json(
      { message: `Radnik ${workerId} isplaćen za iznos ${amount}.` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing payment request:", error);
    return Response.json(
      { message: "Došlo je do greške pri obradi zahtjeva za isplatu." },
      { status: 500 },
    );
  }
}
