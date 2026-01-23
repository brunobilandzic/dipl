import seedAppUsers from "@/lib/seed/users/appUsers";

export default {
  handleAPIRequest,
};

async function handleAPIRequest(seedType) {
  switch (seedType) {
    case "Seed Users":
      return await seedAppUsers();

    case "Fetch All":
      
    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}
