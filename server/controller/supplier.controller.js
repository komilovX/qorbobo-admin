const Supplier = require('../models/supplier.model');

module.exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      comment: req.body.comment,
    })
    // await Supplier.update({
    //   supllies: ++supplier.supllies
    // },{
    //   where: {id: supplier.id}
    // })
    res.json({message: 'created'})
  } catch (error) {
    res.status(500).json(error)
  }
}
module.exports.findAllSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll()
    res.json(suppliers)
  } catch (error) {
    res.status(500).json(error)
  }
}
module.exports.findSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(+req.params.id)
    res.json(supplier)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.updateSupplierById = async (req, res) => {
  try {
    await Supplier.update({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      comment: req.body.comment,
    },{
      where: {id: +req.params.id}
    })
    res.json({message: 'updated'})
  } catch (error) {
    res.status(500).json(error)
  }
}
module.exports.deleteSupplierById = async (req, res) => {
  try {
    await Supplier.update({
      deleted: true
    },
    {where: {id : +req.params.id}
    })
    console.log('params', req.params.id);
    res.json({message: 'deleted'})
  } catch (error) {
    res.status(500).json(error)
  }
}
