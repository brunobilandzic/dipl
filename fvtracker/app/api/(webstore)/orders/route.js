import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { createOrder, deleteOrder, getOrders } from "@/lib/webstore/orders";

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

export async function DELETE(req) {
  try {
    await dbConnect();
    const { unathorized } = await fetchManager({
      managerNames: [FINANCIAL_MANAGER],
    });
    if (unathorized) {
      return Response.json({ error: "Nedovoljno ovlasti" }, { status: 403 });
    }
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    await deleteOrder({ orderId });
    return Response.json({ message: "Narudžba obrisana" }, { status: 200 });
  } catch (error) {
    console.error("Greška pri brisanju narudžbe:", error);
    return Response.json(
      { error: "Greška pri brisanju narudžbe" },
      { status: 500 },
    );
  }
}
