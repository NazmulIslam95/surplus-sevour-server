const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ww6tl6.mongodb.net/?retryWrites=true&w=majority`;

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

        const foodsCollection = client.db('surplus_savour').collection('foods')

        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })

        // app.get('/foods', async (req, res) => {
        //     console.log(req.query.email);
        //     let query = {}
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //     }
        //     const result = await foodsCollection.find(query).toArray()
        //     res.send(result)
        // })

        app.post('/foods', async (req, res) => {
            const newFood = req.body;
            console.log(newFood);
            const result = await foodsCollection.insertOne(newFood)
            res.send(result)
        })

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.deleteOne(query)
            res.send(result)
        })


        const foodRequestCollection = client.db('surplus_savour').collection('foodRequests')

        app.get('/foodRequests', async (req, res) => {
            const cursor = foodRequestCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/foodRequests', async (req, res) => {
            const newRequest = req.body;
            console.log(newRequest);
            const result = await foodRequestCollection.insertOne(newRequest)
            res.send(result)
        })

        app.delete('/foodRequests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodRequestCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SURPLUS SAVOUR SERVER IS RUNNING')
})

app.listen(port, () => {
    console.log(`SURPLUS SAVOUR SERVER IS RUNNING ON PORT ${port}`);
})