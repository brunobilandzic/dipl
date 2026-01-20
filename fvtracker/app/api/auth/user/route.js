export function GET(req) {
  console.log("User route GET called");
  return new Response(JSON.stringify({ message: "User route GET" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
