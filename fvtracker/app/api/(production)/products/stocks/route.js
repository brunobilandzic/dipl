export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
}
