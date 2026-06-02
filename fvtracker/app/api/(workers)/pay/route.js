import { fetchManager } from "@/lib/auth/fetchSessionData";
import { MANAGER_TYPES } from "@/lib/constants/users/managerTypes";
import { Worker } from "@/models/user/workers";

export async function POST(req) {
  try {
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({ managerNames: MANAGER_TYPES });
    const { workerId, amount } = await req.json();

    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Nemate pravo isplatiti radnika" },
        { status: 403 },
      );
    }
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { $inc: { payedAmount: amount } },
      { new: true },
    );

    return Response.json(
      { message: `Radnik ${workerId} isplaćen za iznos ${amount}.`, worker },
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
