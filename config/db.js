// Database Name
const dbName = "photosharing";

export const connectDB = async dbClient => {
  // Use connect method to connect to the server
  await dbClient.connect();
  console.log("Connected successfully to database");
  const db = dbClient.db(dbName);
  // const collection = db.collection("documents");

  // the following code examples can be pasted here...

  return "done.";
};
