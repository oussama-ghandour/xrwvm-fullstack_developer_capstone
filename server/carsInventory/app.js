/*jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const carsData = JSON.parse(fs.readFileSync('car_records.json', 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' });


const Cars = require('./inventory');

try {

  Cars.deleteMany({}).then(() => {
    Cars.insertMany(carsData.cars);
  });
} catch (error) {
  console.error(error);
}

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Endpoints for querying cars based on diff crit

// cars id
app.get('/cars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});


//cars make
app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id, make: req.params.make});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by car make and model' });
  }
});

//cars model
app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});

// cars mileage
app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    let mileage = parseInt(req.params.mileage)
    let condition = {};
    condition =
        mileage === 50000 ? { $lte: mileage } :
        mileage === 100000 ? { $lte: mileage, $gt: 50000 } :
        mileage === 150000 ? { $lte: mileage, $gt: 100000 } :
        mileage === 200000 ? { $lte: mileage, $gt: 150000 } :
        { $gt: 200000 };
    const documents = await Cars.find({ dealer_id: req.params.id, mileage : condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});

// cars price
app.get('/carsbyprice/:id/:price', async (req, res) => {
    try {
        let price = parseInt(req.params.price)
        let condition = {}
        condition =
        price === 20000 ? { $lte: price } :
        price === 40000 ? { $lte: price, $gt: 20000 } :
        price === 60000 ? { $lte: price, $gt: 40000 } :
        price === 80000 ? { $lte: price, $gt: 60000 } :
        { $gt: 80000 };
        const documents = await Cars.find({ dealer_id: req.params.id, price : condition });
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers by ID' });
      }
});


// cars year
app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, year : { $gte :req.params.year }});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by ID' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
