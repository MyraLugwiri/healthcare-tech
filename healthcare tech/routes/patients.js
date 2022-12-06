// Contains the functions that will allow patients to search for specific medication and find the nearest pharmacy with the medication
const express = require('express');
const router = express.Router();

//load pharmacy medication
const pharmacy_medication = require("../models/pharmacy_medication");

// load insurance model 
const insurance = require("../models/insurances");

// Get users medication request and search for it
router.get("/search", (req, res) => {
    const search_medication = "Omeprazole"
    let pharmacy_name
    let email
    let location
    let brand_names
    const max = 190
     // setup options for query
    var options             = {};
    options.spherical       = true;
    options.maxDistance     = parseInt(max)/6370000;
  
    pharmacy_medication.find({drug_name:search_medication}, {pharmacy_name:1, email:1, location:1, brand_names:1, _id:0}, (err, data)=>{
        // pharmacy_name = data[0].pharmacy_name
        // email = data[0].email
        location = data[0].location
        let new_location = { type: 'Point', coordinates:[30.0572, 1.9463]}
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
            function(err, results) {
              if (err) {
                console.log(err)
                
              } else {
                console.log(results)
              }
            }
          )
    })
   
    
})
module.exports = router;