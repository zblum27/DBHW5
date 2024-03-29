// Query4: (25pts) Who are the top 10 people that got more retweets in average, after tweeting more than 3 times
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
          avgRetweets: { $avg: "$retweet_count" }, 
          tweetCount: { $sum: 1 } 
        }
      },
      {
        $match: {
          tweetCount: { $gt: 3 }
        }
      },
      { $sort: { avgRetweets: -1 } }, 
      { $limit: 10 } 
    ];

    const result = await collection.aggregate(pipeline).toArray();
    console.log("Top 10 people by average retweets, after tweeting more than 3 times:");
    result.forEach((user, index) => {
      console.log(`${index + 1}. ${user._id} - Average retweets: ${user.avgRetweets.toFixed(2)}, Tweets: ${user.tweetCount}`);
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

