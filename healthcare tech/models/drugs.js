// schema used by the admin to add new drugs to the list
const mongoose = require('mongoose')

const DrugSchema = new mongoose.Schema({
    generic_name:{
        type: String,
        trim: true
    }, 
    dosage_forms:[String],

    brand_names:[String
    ],

    drug_class:{
        type: String,
        trim: true
    },
    description:{
        type: String,
        trim: true
    }
});

const  drugs = mongoose.model('drugs', DrugSchema);

module.exports = drugs;