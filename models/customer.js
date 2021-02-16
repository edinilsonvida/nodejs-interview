const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'City'
  }
})

module.exports = mongoose.model('Customer', customerSchema)