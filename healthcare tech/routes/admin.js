// will allow the admin to make changes to the list containing medication & list containing insurance companies
const express = require('express');
const router = express.Router();



// load drug model
const drugs = require("../models/drugs");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load insurance model
const insurance = require("../models/insurances")

// display admin dashboard
//router.get('/', forwardAuthenticated, (req, res) => res.render('admin'));

// display medication changes page (CREATE THE MEDICATION PAGE AS AN VIEW IN EJS)
router.get('/medication', forwardAuthenticated, (req, res) => res.render('medication'));

// Display the insurance page 
router.get('/insurance', forwardAuthenticated, (req, res) => res.render('insurance'));

//register new medication
router.post('/medication', (req, res) => {
    const { generic_name, dosage_forms, brand_names, drug_class, description } = req.body;
    let errors = [];
    console.log(req.body)
    if(!generic_name || !dosage_forms || !brand_names || !drug_class || !description ){
        errors.push({ msg: 'Please enter all fields'})
    }

    if(errors.length > 0){
        res.render('medication', {
            errors,
            generic_name,
            dosage_forms,
            brand_names,
            drug_class,
            description
        });
    } else {
        drugs.findOne({ generic_name: generic_name }).then(drug =>{
            if(drug) {
                errors.push({ msg: 'medication already exists'});
                res.render('medication', {
                    errors,
                    generic_name,
                    dosage_forms,
                    brand_names,
                    drug_class,
                    description
                });
            } else {
                const newDrug = new drugs({
                    generic_name,
                    dosage_forms,
                    brand_names,
                    drug_class,
                    description
                });
                newDrug.save()
                .then(drug => {
                    req.flash(
                        'success_msg',
                        'Medication added to the list'
                        );
                        res.redirect('/admin/medication');
                })
                .catch(err => console.log(err));
            }
        })
    }
})

// Display list of all medication on the admin dashboard
router.get('/', forwardAuthenticated, (req, res) =>{
    drugs.find()
    .then(data => res.json(data))
    .catch(error => res.json(error))
})

// save new insurance company
router.post('/insurance', (req, res) => {
    const { name, location} = req.body
    let errors = [];
    console.log(req.body)
    if(!name || !location){
        errors.push({ msg: 'Please enter all fields'})
    }
    if(errors.length > 0){
        res.render('insurance', {
            errors,
            name,
            location
        })
    } else {
        insurance.findOne({name: name}).then(insurances =>{
            if(insurances){
                errors.push({ msg: 'Insurance company already in the system'});
                res.render('insurance', {
                    errors,
                    name,
                    location
                });
            } else {
                const newInsurance = new insurance({
                    name,
                    location
                });
                newInsurance.save()
                .then(insurances => {
                    req.flash(
                        'success_msg',
                        'Insurance Company added Successfully'
                    );
                    res.redirect('/admin/insurance');
                })
                .catch(err => console.log(err));
            }
        });
    }
})

// Display the insurance company list
router.get("/delete/admin/insurance/list", (req, res) => {
    insurance.find((err, docs) => {
        console.log(docs)
        if(!err){
            res.render("delete_insurance", {
                data: docs,
            })
        }else {
            console.log(err)
        }
    })
})

// Remove an insurance company from the list
router.get("/delete/:id", (req, res) => {
    insurance.findByIdAndRemove(req.params.id, (err, doc) =>{
        if(!err){
            res.redirect("admin/insurance/list")
        }else{
            console.log(err);
        }
    })
})
module.exports = router;