// testdb.js
// Quick standalone script to verify your MongoDB connection string works.
// Run with: node testdb.js
// Make sure MONGODB_URI is set in your .env file, or paste it directly below for a one-off test.

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('❌ No connection string found. Set MONGODB_URI (or DATABASE_URL) in your .env file.');
  process.exit(1);
}

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();

    // Ping the database to confirm a real connection, not just a client object
    await client.db().admin().ping();
    console.log('✅ Successfully connected to MongoDB!');

    // Optional: list databases to confirm access level
    const dbs = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach((db) => console.log(`  - ${db.name}`));

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB.');
    console.error('Error details:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

testConnection();