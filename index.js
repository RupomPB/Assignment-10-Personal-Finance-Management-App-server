const express = require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection =db.collection('users')

    // user post
    app.post('/users', async(req, res)=>{
      const newUser = req.body;
      const email = req.body.email;
      const query = {email: email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        res.send({message: 'user already exits. do not insert again'})
      }
      else{
        const result = await userCollection.insertOne(newUser);
        res.send(result)
      }
    })

    // post transaction to DB
    app.post('/transactions', async (req, res)=>{

       const newTransaction = req.body;
      const result = await transactionCollection.insertOne(newTransaction);
      res.send(result);
    
    })

    // get transaction

    app.get('/transactions', async(req, res)=>{
      const cursor =transactionCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })


    app.get('/transactions/:email', async(req, res )=>{
      const email = req.params.email;
      const query ={email: email}
      const result = await transactionCollection.findOne(query);
      res.send(result)

    })

    // update transaction
    app.patch('/transactions/:id',async(req, res)=>{
      const id =req.params.id;
      const updateTransaction = req.body;
      const query = { _id: new ObjectId(id)}
      const update ={
        $set:{
          name: updateTransaction.name,
          email: updateTransaction.email
        }
      }
    })

    // delete transaction
    app.delete('/transactions/:id',async(req, res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await transactionCollection.deleteOne(query);
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