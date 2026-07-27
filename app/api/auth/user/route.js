import dbConnect from "@/lib/db/mongooseConnect";

export async function GET(req) {
  await dbConnect();
  return new Response(JSON.stringify({ message: "User route GET" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
