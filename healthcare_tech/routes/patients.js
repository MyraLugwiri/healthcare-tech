// Contains the functions that will allow patients to search for specific medication and find the nearest pharmacy with the medication
const express = require('express');
const router = express.Router();
const axios = require('axios');

//load pharmacy medication
const pharmacy_medication = require("../models/pharmacy_medication");

// load insurance model 
const insurance = require("../models/insurances");

//load the map
router.get('/display', (req, res) => res.render('display_map'))

const key = "AIzaSyBYQ2YdqRYx4B3QXegj2H8xERWnXsXGGRg"
//load the medication view 
router.get('/search', (req, res) => res.render('medication'));

// load the display_map


// Get users medication request and search for it
router.get("/searchmeds", (req, res) => {
  const search_medication = "paracetamol" // will change this to req.body to get user input from the search bar
  let pharmacy_name
  let email
  let location
  let brand_names
  const max = 190
  // setup options for query
  var options = {};
  options.spherical = true;
  options.maxDistance = parseInt(max) / 6370000;

  let lon
  let lat

   // Search users' current location
   function userlocation (){
    try{
      axios.get('http://ipwhois.app/json/').then(({ data }) => {
      lon = data.longitude
      lat = data.latitude
      pharmacy_medication.find({ drug_name: search_medication }, { pharmacy_name: 1, email: 1, location: 1, brand_names: 1, _id: 0 }, (err, data) => {
        // pharmacy_name = data[0].pharmacy_name
        // email = data[0].email
        location = data[0].location
        current_location
        
    
    
        let new_location = { type: 'Point', coordinates: [lon, lat] }
        // brand_names = data[0].brand_names
    
        pharmacy_medication.aggregate(
          [{
            '$geoNear': {
              'near': new_location,
              'spherical': true,
              'maxdistance': 10000,
              'distanceField': 'dist'
            }
          }],
          function (err, results) {
            if (err) {
              console.log(err)
    
            } else {
              res.render('patientsearch',{
                data: results
              });
              console.log(results)
            }
          }
        )
      })
  })

    }catch (err){
      console.log(err)
    }
  }
  let current_location = userlocation();


})
module.exports = router;