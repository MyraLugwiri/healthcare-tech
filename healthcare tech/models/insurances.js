// Schema used by the admin for the entering a list of insurance companies
const mongoose = require("mongoose")

const InsuranceSchema = new mongoose.Schema({
    name:{
        type:String, 
        trim: true
    },
    location:{
        type: String,
    }
});

const insurance = mongoose.model("insurance", InsuranceSchema)
module.exports = insurance