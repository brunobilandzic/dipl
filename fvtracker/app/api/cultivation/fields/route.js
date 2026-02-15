import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    const { slug } = params;
    if (!slug) {
      
    }
  } catch (error) {}
}
