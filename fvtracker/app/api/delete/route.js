//rout to delete db

export async function DELETE(req) {
  try {
    // Logic to delete the database goes here
    console.log("Database deleted successfully.");
    return new Response("Database deleted successfully.", { status: 200 });
  } catch (error) {
    console.error("Error deleting database:", error);
    return new Response("Error deleting database.", { status: 500 });
  }
}
