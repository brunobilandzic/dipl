const { MongoClient } = require("mongodb");

const uri = "env.MONGODB_URI";
console.log("MONGODB_URI raw:", uri);
async function run() {
  try {
    console.log("URI exists:", !!uri);
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();