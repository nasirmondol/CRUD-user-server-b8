const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require("express");
const app = express();
const cors = require('cors')
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json())

// user: new-server-with-mongo-b8
// pass: IUKaQhiuX8GWmY9R

const uri = "mongodb+srv://new-server-with-mongo-b8:IUKaQhiuX8GWmY9R@cluster0.jorsk2j.mongodb.net/?retryWrites=true&w=majority";

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
        // const database = client.db('usersDB').usersCollection('users');

        const database = client.db("usersDB").collection('users');


        // find data from the database
        app.get('/users', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const body = req.body;
            const result = await database.insertOne(body);
            res.send(result)
            console.log('user', result);
        })

        // Delete one user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('user Id is deleted', id);
            const query = { _id: new ObjectId(id) };
            const result = await database.deleteOne(query);
            console.log(result);
            res.send(result);
        })


        // Update a document
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await database.findOne(query);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const users = req.body;
            console.log(id, users)
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set:{
                   name : users.name,
                   email: users.email
                }
            }
            const result = await database.updateOne(filter, updateDoc, options);
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


app.get('/', (req, res) => {
    res.send('MongoDb server running')
})

app.listen(port, () => {
    console.log(`Running server on ${port}`)
})