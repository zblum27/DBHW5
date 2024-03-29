// Query1: (10pts) How many tweets are not retweets or replies? (hint the field retweeted_status contains an object when the tweet is a retweeet)
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("ieeevisTweets");
    const collection = database.collection("tweet");

    const query = {
      $and: [
        { retweeted_status: { $exists: false } },
        { in_reply_to_status_id: { $exists: false } },
        { in_reply_to_user_id: { $exists: false } }
      ]
    };
    const count = await collection.countDocuments(query);
    console.log(`Number of tweets that are not retweets or replies: ${count}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
