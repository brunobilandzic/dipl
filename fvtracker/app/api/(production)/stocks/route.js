import { getStocks } from "@/lib/production/stocks";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    const stocks = await getStocks();
    return Response.json(
      { stocks },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
