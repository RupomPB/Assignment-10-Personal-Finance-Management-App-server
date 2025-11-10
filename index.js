const express = require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json());


// uFfgmxpRlQ1w3kE7

const uri = "mongodb+srv://FinEase-db:uFfgmxpRlQ1w3kE7@cluster0.xnvicz3.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('FinEase-db');
    const transactionCollection = db.collection('transaction');

    // post transaction to DB
    app.post('/transactions', async (req, res)=>{
      const newTransaction = req.body;
      const result = await transactionCollection.insertOne(newTransaction);
      res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('User Server is running all are  fine')
})


app.listen(port, () => {
  console.log(`User  Server is listening on port ${port}`)
})