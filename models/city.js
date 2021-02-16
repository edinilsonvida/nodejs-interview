const mongoose = require('mongoose')
const Customer = require('./customer')

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
})

citySchema.pre('remove', function (next) {
  Customer.find({ city: this.id }, (err, customers) => {
    if (err) {
      next(err)
    } else if (customers.length > 0) {
      next(new Error('Não é possível excluir esta cidade, pois existem clientes vinculados a ela.'))
      console.log('Não é possível excluir esta cidade, pois existem clientes vinculados a ela.')
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('City', citySchema)