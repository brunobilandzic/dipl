import dbConnect from "@/lib/db/mongooseConnect";
import { createOrder } from "@/lib/webstore/orders";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const order = await createOrder(body);
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Greška pri izradi narudžbe:", error);
    return Response.json(
      { error: "Greška pri izradi narudžbe" },
      { status: 500 },
    );
  }
}
