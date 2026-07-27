//route to delete db

import { deleteDB } from "@/lib/db/delete";
import dbConnect from "@/lib/db/mongooseConnect";
import { createAdmin } from "@/seed/users/admin";
import { createGeneralManager } from "@/seed/users/generalManager";

export async function DELETE(req) {
  try {
    await dbConnect();
    // Logic to delete the database goes here
    const success = await deleteDB();
    await createAdmin();
    console.log("Database deleted successfully.");
    return Response.json(
      { message: "Database deleted successfully.", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting database:", error);
    return new Response("Error deleting database.", { status: 500 });
  }
}
