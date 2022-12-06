
const axios = require('axios');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim:true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role:{
    type:String,
    trim: true
  },
  // city: {
  //   type: String
  // },
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }
  },
});

//get users current location and save it to the database
UserSchema.pre('save', async function(next) {
  const data  = await axios.get('http://ipwhois.app/json/')
  this.location = {
    type: 'Point',
    coordinates: [ data.data.longitude,  data.data.latitude],
  };
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;