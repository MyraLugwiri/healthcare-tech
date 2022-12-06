// Schema used accessed by pharmacy where they can add & remove the list of medication
const mongoose = require('mongoose')

const PharmacyMedication = new mongoose.Schema({
    pharmacy_name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    location: {
        type:{
            type:String,
            enum: ['Point'],
        },
        coordinates:{
            type: [Number],
            index: "2dsphere"
        }
    },
    drug_name:{
        type:String,
        trim:true
    },
    brand_names:[String],
});

const pharmacy_medication = mongoose.model('pharmacy_medication', PharmacyMedication);
module.exports = pharmacy_medication;