const Customer = require('../models/customer')

// Cria e salva um cliente
exports.createCustomer = (req, res) => {
  // Valida a requisição
  if (!req.body) {
    res.status(400).send({
      message: "Os campos não podem ficar vazios!"
    })
  }

  // Cria um cliente
  const customer = new Customer({
    name: req.body.name,
    gender: req.body.gender,
    birthDate: new Date(req.body.birthDate),
    city: req.body.city
  })

  // Salva o cliente no banco de dados
  Customer.create(customer, (err, customer) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Um erro ocorreu durante a criação do cliente."
      });
    else res.send(customer);
  })
}

//Recupera todos os clientes do banco de dados
exports.findAllCustomers = (req, res) => {
  Customer.find((err, customer) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Um erro ocorreu durante a recuperação da listagem dos clientes."
      });
    else res.send(customer);
  })
}

//Encontra o cliente pelo id informado
exports.findCustomerById = (req, res) => {
  Customer.findById(req.params.id, (err, customer) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Nenhum cliente foi encontrado pelo id ${req.params.id} informado.`
        })
      } else {
        res.status(500).send({
          message: `Um erro ocorreu durante a recuperação do cliente pelo id ${req.params.id} informado.`
        })
      }
    } else res.send(customer)
  })
}

//Encontra o cliente pelo nome informado
exports.findCustomerByName = (req, res) => {
  Customer.findOne(req.params.name, (err, customer) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Nenhum cliente foi encontrado pelo nome ${req.params.name} informado.`
        })
      } else {
        res.status(500).send({
          message: `Um erro ocorreu durante a recuperação do cliente pelo nome ${req.params.name} informado.`
        })
      }
    } else res.send(customer)
  })
}

//Atualiza o cliente pelo id informado
exports.updateCustomerById = (req, res) => {
  // Valida a requisição
  if (!req.body) {
    res.status(400).send({
      message: "Os campos não podem ficar vazios!"
    });
  }

  Customer.findById(req.params.id, function (err, customer) {
    if (err)
      res.send('err: ' + err);
    customer.name = req.body.name;
    customer.gender = req.body.gender;
    customer.birthDate = new Date(req.body.birthDate);
    customer.city = req.body.city;
    customer.save(function (err) {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Nenhum cliente foi encontrado pelo id ${req.params.id} informado.`
          });
        } else {
          res.status(500).send({
            message: `Um erro ocorreu durante a atualização do cliente pelo id ${req.params.id} informado.`
          });
        }
      } else res.send(customer)
    })
  })
}

//Atualiza apenas o nome cliente pelo id informado
exports.updateNameCustomerById = (req, res) => {
  Customer.findById(req.params.id, function (err, customer) {
    if (err)
      res.send('err: ' + err);
    customer.name = req.body.name;
    customer.save(function (err) {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Nenhum cliente foi encontrado pelo id ${req.params.id} informado.`
          });
        } else {
          res.status(500).send({
            message: `Um erro ocorreu durante a atualização do nome do cliente pelo id ${req.params.id} informado.`
          });
        }
      } else res.send(customer)
    })
  })
}

//Exclui o cliente pelo id informado
exports.deleteCustomerById = (req, res) => {
  Customer.findOneAndDelete(req.params.id, (err, customer) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Nenhum cliente foi encontrada pelo id ${req.params.id} informado.`
        })
      } else {
        res.status(500).send({
          message: `Um erro ocorreu durante a exclusão do cliente pelo id ${req.params.id} informado.`
        })
      }
    } else res.send({ message: "Cliente excluído com sucesso!" })
  })
}

//Exclui todos os clientes do banco de dados
exports.deleteAllCustomers = (req, res) => {
  Customer.remove((err, customer) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Um erro ocorreu durante a exclusão de todos os clientes."
      })
    else res.send({ message: "Todos os clientes foram excluídos com sucesso!" })
  })
}