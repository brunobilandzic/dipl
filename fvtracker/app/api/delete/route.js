//route to delete db

import { deleteDB } from "@/lib/db/delete";

export async function DELETE(req) {
  try {
    // Logic to delete the database goes here
    const success = await deleteDB();
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
