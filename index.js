
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function run () {
        try{
            await client.connect();
            const database = client.db("bongoServiec")
        const dataCollection = database.collection("bongoinfo")
        const dataCollection2 = database.collection("allOrders")


        //  post api
        app.post('/addService', async (req,res)=>{
            const service = req.body;
            const result = await dataCollection.insertOne(service);
            res.send(result)

        })

        // get api
        app.get('/services', async (req,res)=>{
            const result = await dataCollection.find({}).toArray();
            res.send(result)
        })

        // find api
        app.get(`/services/:id`, async (req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await dataCollection.findOne(query);
            res.send(result)
        })

        // post api
        app.post('/allData', async (req,res)=>{
            const query = req.body;
            const result= await dataCollection2.insertOne(query)
            res.send(result)
        })


        // get api
        app.get('/allData', async (req,res)=>{
            const result = await dataCollection2.find({}).toArray();
            res.send(result)       
        })


        // delete items from all Manages
        app.delete('/deleteAll/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await dataCollection2.deleteOne(query)
            res.send(result)
        })



    // delete my data
    app.delete('/allData/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await dataCollection2.deleteOne(query)
        res.send(result)
    })



    // update status
    app.put('/update/:id' , async (req,res)=>{
        const id= req.params.id;
        const updateData = req.body;
        const query = {_id: ObjectId(id)}
        const result = await dataCollection2.updateOne(query, {
            $set: {
                status: updateData.status,
            }
        })
        res.send(result)
          
    })
        
        }
        finally{
            // await client.close();
        }
    }
    run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })