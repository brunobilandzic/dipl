import { handlers } from "@/auth";
import dbConnect from "@/lib/db/mongooseConnect";

export async function GET(req, context) {
  await dbConnect();
  return handlers.GET(req, context);
}

export async function POST(req, context) {
  await dbConnect();
  return handlers.POST(req, context);
}
