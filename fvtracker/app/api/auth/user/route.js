export function GET(req) {
  return new Response(JSON.stringify({ message: "User route GET" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
