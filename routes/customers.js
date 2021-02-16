const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const City = require('../models/city')
const { check, validationResult } = require('express-validator')

// All Customers Route
router.get('/', async (req, res) => {
  let query = Customer.find()
  if (req.query.id != null && req.query.id != '') {
    query = query.regex('id', new RegExp(req.query.id, 'i'))
  }
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  try {
    const customers = await query.exec()
    res.render('customers/index', {
      customers: customers,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Customer Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Customer())
})

// Create Customer Route
router.post('/',
  [
    check('name').isLength({ min: 5 }).withMessage("O nome precisa ter no mínimo 5 caracteres."),
    check('birthDate').isDate().withMessage("Por favor, informe uma data válida."),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const customer = new Customer({
      name: req.body.name,
      gender: req.body.gender,
      birthDate: new Date(req.body.birthDate),
      city: req.body.city
    })
    try {
      const newCustomer = await customer.save()
      res.redirect(`customers/${newCustomer.id}`)
    } catch {
      renderNewPage(res, customer, true)
    }
  })

// Show Customer Route
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('customer')
      .exec()
    res.render('customers/show', { customer: customer })
  } catch {
    res.redirect('/')
  }
})

// Edit Customer Route
router.get('/:id/edit', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    renderEditPage(res, customer)
  } catch {
    res.redirect('/')
  }
})

// Update Customer Route
router.put('/:id',
  [
    check('name').isLength({ min: 5 }).withMessage("O nome precisa ter no mínimo 5 caracteres."),
    check('birthDate').isDate().withMessage("Por favor, informe uma data válida."),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let customer
    try {
      customer = await Customer.findById(req.params.id)
      customer.name = req.body.name
      customer.gender = req.body.gender
      customer.birthDate = new Date(req.body.birthDate)
      customer.city = req.body.city
      await customer.save()
      res.redirect(`/customers/${customer.id}`)
    } catch {
      if (customer != null) {
        renderEditPage(res, customer, true)
      } else {
        redirect('/')
      }
    }
  })

// Delete Customer Page
router.delete('/:id', async (req, res) => {
  let customer
  try {
    customer = await Customer.findById(req.params.id)
    await customer.remove()
    res.redirect('/customers')
  } catch {
    if (customer != null) {
      res.render('customers/show', {
        customer: customer,
        errorMessage: 'Erro durante a exclusão do cliente.'
      })
      res.json({ message: "Erro durante a exclusão do cliente." })
      console.log('Erro durante a exclusão do cliente.')
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, customer, hasError = false) {
  renderFormPage(res, customer, 'new', hasError)
}

async function renderEditPage(res, customer, hasError = false) {
  renderFormPage(res, customer, 'edit', hasError)
}

async function renderFormPage(res, customer, form, hasError = false) {
  try {
    const cities = await City.find({})
    const params = {
      cities: cities,
      customer: customer
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Erro durante a edição do cliente.'
        res.json({ message: "Erro durante a edição do cliente." })
        console.log('Erro durante a edição do cliente.')
      } else {
        params.errorMessage = 'Erro durante a criação do cliente.'
        res.json({ message: "Erro durante a criação do cliente." })
        console.log('Erro durante a criação do cliente.')
      }
    }
    res.render(`customers/${form}`, params)
  } catch {
    res.redirect('/customers')
  }
}

module.exports = router