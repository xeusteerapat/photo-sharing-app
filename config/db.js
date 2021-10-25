// Database Name
const dbName = "photosharing";

export const connectDB = async dbClient => {
  // Use connect method to connect to the server
  const db = dbClient.db(dbName);
  console.log("Connected successfully to database");

  return db;
};
