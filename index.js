const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors()); 0
app.use(express.json());


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-1bjla5v-shard-00-00.dieisxt.mongodb.net:27017,ac-1bjla5v-shard-00-01.dieisxt.mongodb.net:27017,ac-1bjla5v-shard-00-02.dieisxt.mongodb.net:27017/?ssl=true&replicaSet=atlas-n02o7o-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const dataCollection = client.db('chartDashboarddb').collection('dataCollection');

        app.get('/alldata', async (req, res) => {
            const query = {}
            const result = await dataCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/countryWise', async (req, res) => {
            var query = {};
            console.log(req.query);
            if (req.query.country) {
                query = { country: req.query.country };
            }
            const data = await dataCollection.find(query).toArray();
            res.send(data);
        });
        app.get('/sectorWise', async (req, res) => {
            var query = {};
            if (req.query.sector) {
                query = { sector: req.query.sector };
            }
            if (req.query.source) {
                query = { source: req.query.source };
            }
            if (req.query.topic) {
                query = { topic: req.query.topic };
            }
            if (req.query.end_year) {

                query = { end_year: parseInt(req.query.end_year) };
            }
            if (req.query.region) {

                query = { region: req.query.region };
            }
            const data = await dataCollection.find(query).toArray();
            // console.log("end year", data);
            res.send(data);
        });


    }
    finally {

    }

}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Chart Dashboard server is running');
})

app.listen(port, () => console.log(`Chart Dashboard running on ${port}`))