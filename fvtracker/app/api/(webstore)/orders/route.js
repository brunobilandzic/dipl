import dbConnect from "@/lib/db/mongooseConnect";
import { createOrder, getOrders } from "@/lib/webstore/orders";

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

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const orders = await getOrders({ customerId });
    return Response.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi:", error);
    return Response.json(
      { error: "Greška pri dohvaćanju narudžbi" },
      { status: 500 },
    );
  }
}
