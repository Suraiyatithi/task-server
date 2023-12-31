const express=require('express');
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app=express();
const port=process.env.PORT||5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2jwpece.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection


    const taskCollection=client.db('Taskmange').collection('tasks')
app.get('/tasks',async(req,res)=>{
    const cursor=taskCollection.find();
    const result=await cursor.toArray()
    res.send(result);
})
app.post('/tasks',async(req,res)=>{
    const adding=req.body;
    console.log(adding);
    const result=await taskCollection.insertOne(adding);
    res.send(result);
  })
  app.get('/tasks/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result=await taskCollection.findOne(query);
    res.send(result)
  })
  app.delete('/tasks/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result=await taskCollection.deleteOne(query);
    res.send(result);
  })
  app.put("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    console.log(body);
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        taskTitle: body.taskTitle,
        taskDescription: body.taskDescription,
        Details: body.Details,
        status: body.status,
        time: body.time,
      },
    };
    const result = await taskCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('task is running ')
})
app.listen(port,()=>{
    console.log(`task is running on the port: ${port}`)
})
