
const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(fileUpload())
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function run () {
        try{
            await client.connect();
            const database = client.db("bongoServiec")
        const dataCollection = database.collection("bongoinfo")
        const dataCollection2 = database.collection("allOrders")
        console.log('database connected')


        // add service with img upload 
        app.post('/addService', async (req,res)=>{
            const title= req.body.title;
            const price = req.body.price;
            const description = req.body.description;
            const picture = req.files.image;
            const pictureData = picture.data;
            const encodedPicture = pictureData.toString('base64')
            const imageBuffer = Buffer.from(encodedPicture, 'base64')
            const services = {
                title,
                price,
                description,
                image: imageBuffer
            }
            const result = await dataCollection.insertOne(services)
            
            res.json(result)
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