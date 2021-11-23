const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g8d1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("carCollection")
        const productCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection("users")

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)

        })

        // DELETE product API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
            //console.log(result)
        })

        // POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        });

        // GET orders api
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            // console.log(orders)
            res.send(orders);
        })

        // DELETE order api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
            // console.log(result)
        })

        // POST review api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            //console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        // GET review api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
            //console.log(reviews)
        })

        // users POST api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
            //console.log(result)
        })

        // admin UPDATE api
        app.put('/admin', async (req, res) => {
            //console.log(req.body)
            const filter = { email: req.body.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
            //console.log(result)
        })

        // admin check api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            //console.log(email)
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        // status update
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updateDoc = { $set: { status: req.body.status } }
            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.json(result);
            //console.log(result)
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello car World')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})