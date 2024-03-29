// Query3: (10pts) Who is the person that got the most tweets?
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const collection = database.collection("tweet");
    const pipeline = [
      {
        $group: {
          _id: "$user.screen_name", 
          tweetCount: { $sum: 1 } 
        }
      },
      { $sort: { tweetCount: -1 } }, 
      { $limit: 1 } 
    ];
    const result = await collection.aggregate(pipeline).toArray();
    if (result.length > 0) {
      console.log(`The person with the most tweets is: ${result[0]._id} with ${result[0].tweetCount} tweets`);
    } else {
      console.log("No data found");
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
