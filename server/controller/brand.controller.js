const fs = require('fs');
const path = require('path');

const Brands = require('../models/brand.model');

module.exports.createBrand = async (req, res) => {
  try {
    await Brands.create({
      name: req.body.name,
      photo: `/${req.file.filename}`
    })
    res.json({message: 'created!'})
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findAllBrands = async (req, res) => {
  try {
    res.json(res.result)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findById = async (req, res) => {
  try {
    const brands = await Brands.findByPk(+req.params.id)
    res.json(brands)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.updateById = async (req, res) => {
  try {
    if (!req.file) {
      await Brands.update({
        name: req.body.name
      },{
        where: {id: +req.params.id}
      })
      res.json({message: 'updated'})
    }
    else {
      const brand = await Brands.findByPk(+req.params.id)
      let photo = brand.photo.replace('/','')
      let way = path.resolve(__dirname,`../../static/uploads/${photo}`)
      await Brands.update({
        name: req.body.name,
        photo: `/${req.file.filename}`
      },{
        where: {id: +req.params.id}
      })
      res.json({message: 'updated'})
      fs.unlinkSync(way)
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    const brand = await Brands.findByPk(+req.params.id)
    let photo = brand.photo.replace('/','')
    let way = path.resolve(__dirname,`../../static/uploads/${photo}`)

    await Brands.destroy({where: {id: +req.params.id}})
    res.json({message: 'deleted'})
    fs.unlinkSync(way)
  } catch (e) {
    res.status(500).json(e)
  }
}
