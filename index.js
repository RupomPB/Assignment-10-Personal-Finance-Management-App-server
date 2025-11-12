const express = require('express')
const cors =require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
console.log(process.env)
const port =process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnvicz3.mongodb.net/?appName=Cluster0`;

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

       newTransaction.createdAt = new Date();

      const result = await transactionCollection.insertOne(newTransaction);
      res.send(result);
    
    })

    // get transaction with sort

    app.get('/transactions', async(req, res)=>{
      const {email, sort} =req.query;
      const query ={};
      if(email){
        query.email = email;
      }

      let sortOption = {createdAt: -1};

      if(sort === "amount"){
        sortOption ={amount: -1}
      }
      if(sort === 'date'){
        sortOption={date: -1};
      }
      if(sort === 'none'){
        sortOption ={};
      }

      const cursor =transactionCollection.find(query)
        const transactions = Object.keys(sortOption).length > 0 
      ? await cursor.sort(sortOption).toArray() 
      : await cursor.toArray();

      res.status(200).send(transactions);
    })

    // data for chart 

    app.get('/report-data', async(req, res)=>{
      const email = req.query.email;
      const query ={};
      if(email){
        query.email = email;
      }
      const cursor = transactionCollection.find(query);
      const result = await cursor.toArray();
      res.status(200).send(result);
    })

    // get transaction by id
    app.get('/transactions/:id', async(req, res )=>{
     const {id} =req.params;
     const query ={_id: new ObjectId(id)};
     const result= await transactionCollection.findOne(query);
     res.status(200).send(result)
    })

    // update transaction
    app.patch('/transactions/:id',async(req, res)=>{
      const id =req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(id)}
      const update ={
        $set:{
          type: updateInfo.type,
          category: updateInfo.category,
          amount:updateInfo.amount,
          description: updateInfo.description,
          date: updateInfo.date,
        },
      }
      const result= await transactionCollection.updateOne(query, update);
      res.send(result);
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