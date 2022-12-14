// Will allow users(pharmacy's) to either add or remove medication from the list displayed to patients
const express = require("express");
const router = express.Router();

//load the pharmacy_medication model
const pharmacy_medication = require("../models/pharmacy_medication");
//load the drug model (contains the medication model)
const drugs = require("../models/drugs")
// load the users model (contains details about the pharmacy)
const user = require("../models/Users")
// Authentication 
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Display the list of pharmacy medication (Create a dashboard for pharmacy)
router.get("/pharmacy_medication", (req, res) => {
    pharmacy_medication.find((err, docs) => {
        if(!err){
            console.log(docs);
            res.render("dashboard", {
                data:docs,
            })
        } else {
            console.log(err)
        }
    })
})

// display the list of available drugs that a pharmacy can select from
router.get("/medication", (req, res) => {
    drugs.find((err, docs) => {
        if(!err){
            res.render("dashboard", {
                medication:docs,
            })
        } else {
            console.log(err)
        }
    })
})

// allow pharmacy official to select the medication they want
router.get("/add/:email/:id", (req, res) => {
    let drug_name
    let brand_names
    drugs.find({_id:req.params.id}, {generic_name:1, brand_names:1, _id:0}, (err, data) =>{
        drug_name = data[0].generic_name
        brand_names = data[0].brand_names    
    })
   
    const email = req.params.email
    // on frontend a pharmacy needs to enter its name
    user.findOne({ email: email}).then(person => {
        const location = person.location
        const pharmacy_name = person.name
        if(person){
            const newMedication = new pharmacy_medication({
                pharmacy_name,
                email,
                location,
                drug_name,
                brand_names
            });
            newMedication.save();
            res.redirect("/pharmacy/medication");
        }
    })
})
module.exports = router;