const Store = require('../models/store.model');

module.exports.createStore = async (req, res) => {
  try {
    await Store.create({
      name: req.body.name,
      address: req.body.address,
    })
    res.json({message: 'created'})
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findAllStore = async (req, res) => {
  try {
    const stores = await Store.findAll({raw: true})
    res.json(stores)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(+req.params.id)
    res.json(store)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.updateById = async (req, res) => {
  try {
    await Store.update(
      {
        name: req.body.name,
        address: req.body.address,
      },
      { where: {id: req.params.id }}
    )
    res.json({message: 'updated!'})
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    await Store.update(
      {
        deleted: true
      },
      { where: {id: req.params.id }}
    )
    res.json({message: 'updated!'})
  }
  catch (e) {
    res.status(500).json(e)
  }
}
