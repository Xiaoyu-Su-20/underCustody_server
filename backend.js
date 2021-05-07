const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db.js'); //database connection pooling

//middleware
app.use(cors());
app.use(express.json()); //access to json body, client side data

//ROUTES
//get all underCustody data
app.get("/underCustody", async(req,res) => {
    try {
      // console.log(req. query)
      const allData = await pool.query(" \
        SELECT sex, age, modEthRace, timeServed, \
               timeServedBinned, ageBinned, crimeCounty, \
               downstateResident, nycResident, \
               prisonSecLevel, prison \
        FROM underCustody \
      ");
      res.json(allData.rows);
    } catch (err) {
      console.error(err.message);
    }
})

// get all ny state GeoJSON data
app.get("/nystateGeoJSON", async(req,res) => {
    try {
      const allData = await pool.query(" \
        SELECT * \
        FROM ny_state_geojson \
      ");
      res.json(allData.rows);
    } catch (err) {
      console.error(err.message);
    }
})

app.listen(5000, () => {
  console.log('server has started on port 5000')
})
