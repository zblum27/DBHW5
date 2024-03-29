// Query2: (10pts) Return the top 10 screen_names by their number of followers.
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
          maxFollowers: { $max: "$user.followers_count" }
        }
      },
      { $sort: { maxFollowers: -1 } },
      { $limit: 10 } 
    ];
    const result = await collection.aggregate(pipeline).toArray();
    console.log("Top 10 screen names by number of followers:");
    result.forEach((user, index) => {
      console.log(`${index + 1}. ${user._id} - ${user.maxFollowers} followers`);
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);