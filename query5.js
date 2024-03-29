// Query5: (30pts) Write the instructions that will separate the Users information into a different collection
// Create a user collection that contains all the unique users.
// Create a new Tweets_Only collection, that doesn't embed the user information, but instead references it using the user id
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function createUserCollection() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");
    const pipeline = [
      {
        $group: {
          _id: "$user.id_str", 
          user: { $first: "$user" } 
        }
      },
      {
        $replaceRoot: { newRoot: "$user" } 
      }
    ];

    const users = await tweets.aggregate(pipeline).toArray();
    const usersCollection = database.collection("Users");
    await usersCollection.insertMany(users);

    console.log(`Inserted ${users.length} unique users into the Users collection.`);
  } finally {
    await client.close();
  }
}

createUserCollection().catch(console.dir);

async function createTweetsOnlyCollection() {
    try {
      await client.connect();
      const database = client.db("ieeevisTweets");
      const tweets = database.collection("tweet");
  
      
      const allTweets = await tweets.find({}).toArray();
      const tweetsOnlyData = allTweets.map(tweet => {
        const { user, ...tweetData } = tweet; 
        return {
          ...tweetData,
          userId: user.id_str 
        };
      });
  
      
      const tweetsOnlyCollection = database.collection("Tweets_Only");
      await tweetsOnlyCollection.insertMany(tweetsOnlyData);
  
      console.log(`Inserted ${tweetsOnlyData.length} tweets into the Tweets_Only collection.`);
    } finally {
      await client.close();
    }
  }
  