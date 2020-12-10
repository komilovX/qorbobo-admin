const Supply = require('../models/supply.model')
const Supplier = require('../models/supplier.model')
const Product = require('../models/product.model')
const Category = require('../models/category.model');
const Store = require('../models/store.model')
const Remainder = require('../models/remainder.model')
module.exports.createSupply = async (req, res) => {
  try {
    const products = JSON.parse(req.body.products)
    products.forEach(async p => {
      await Product.update({
        price: p.price
      }, {
        where: {id: +p.id}
      })
      let remainder = await Remainder.findOne({where: {product_id: +p.id}, raw: true})
      if (!remainder) {
        let product = await Product.findByPk(+p.id)
        let category = await Category.findOne({where: {id: +product.category_id}, raw: true})
        const obj = {
          product_name: product.name,
          product_id: p.id,
          category_name: category.name,
          category_id: product.category_id,
          residue: +p.amount
        }
        await Remainder.create(obj)
      }
      else{
        await Remainder.update({
          residue: remainder.residue + (Number(p.amount))
        },{
          where: {id: remainder.id}
        })
      }
    })
    const total = products.reduce((acc, cur) => acc+Number(cur.total),0)
    const supplier = await Supplier.findByPk(+req.body.supplier_id)
    await Supplier.update({
      supplies: supplier.supplies + 1,
      total_cost: supplier.total_cost+total
    },{
      where: {
        id: +req.body.supplier_id
      }
    })
    await Supply.create(req.body)
    res.json({message: 'created'})
  } catch (e) {
    console.log(e);
    res.status(500).json(e)
  }
}
module.exports.findAllSupply = async (req, res) => {
  try {
    res.json(res.result)
  } catch (e) {
    res.status(500).json(e)
  }
}
module.exports.findAllDetailsForSupply = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({where: {deleted: 0},raw: true})
    const stores = await Store.findAll({where: {deleted: 0}, raw: true})
    const products = await Product.findAll({raw: true})
    res.json({suppliers, stores, products})
  } catch (e) {
    res.status(500).json(e)
  }
}
module.exports.findSupplyById = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({raw: true})
    const stores = await Store.findAll({raw: true})
    const products = await Product.findAll({raw: true})
    const supply = await Supply.findByPk(+req.params.id)
    if (!supply) {
     return res.status(404).json({message: 'not found'})
    }
    res.json({products, stores, suppliers, supply})
  } catch (e) {
    console.log(e);
    res.status(500).json(e)
  }
}
module.exports.updateById = async (req, res) => {
  try {
    const products = JSON.parse(req.body.products)
    const supply = await Supply.findByPk(+req.params.id)
    let supply_products = JSON.parse(supply.products)
    let result = []
    products.forEach(async f => {
      const index = result.findIndex(r => r.id == f.id)
      if (index != -1) {
        result[index].amount +=Number(f.amount)
      }
      else{
        result.push(f)
      }
    })
    result.forEach(async r => {
      const finder = supply_products.find(f => f.id == r.id)
      await Product.update({
        price: r.price
      }, {
        where: {id: +r.id}
      })
      const remainder = await Remainder.findOne({where: {product_id: +r.id}, raw: true})
      if (!finder) {
        if (!remainder) {
          let product = await Product.findByPk(+r.id)
          let category = await Category.findOne({where: {id: +product.category_id}, raw: true})
          await Remainder.create({
            product_name: product.name,
            product_id: r.id,
            category_name: category.name,
            category_id: product.category_id,
            residue: +r.amount
          })
        }
        else {
          await Remainder.update({
            residue: +remainder.residue + (Number(r.amount))
          },{
            where: {id: remainder.id}
          })
        }
      }
      else if(finder.amount != r.amount ){
        await Remainder.update({
          residue: +remainder.residue + (Number(r.amount) - finder.amount)
        },{
          where: {id: remainder.id}
        })
      }
    })
    let oldTotal = supply_products.reduce((acc, cur) => acc+Number(cur.total),0)
    let newTotal = products.reduce((acc, cur) => acc+Number(cur.total),0)
    if (newTotal != oldTotal) {
      const supplier = await Supplier.findByPk(+req.body.supplier_id)
      await Supplier.update({
        total_cost: supplier.total_cost+Number(newTotal-oldTotal)
      },{
        where: {id: +req.body.supplier_id}
      })
    }
    await Supply.update(req.body,
    {
      where: {id: req.params.id}
    })
    res.json({message: "updated"})
  } catch (e) {
    console.log('error : ',e);
    res.status(500).json(e)
  }
}

module.exports.deleteSupplyById = async (req, res) => {
  try {
    await Supply.update({
      deleted: true
    },
    {
      where: {id: +req.params.id}
    })
    res.json({message: 'deleted'})
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findAllCalculations = async (req, res) => {
  try {
    res.send(res.result)
  } catch (e) {
    res.status(500).json(e)
  }
}
module.exports.updateLimitById = async (req, res) => {
  try {
    await Remainder.update({
      limit:+req.body.limit},{
      where: {id: +req.params.id}
    })
    res.send({message: "updated"})
  } catch (e) {
    res.status(500).json(e)
  }
}
module.exports.changeResidue = async (req, res) => {
  try {
    const products = JSON.parse(req.body.products)
    let bool = false
    products.forEach(async p => {
      const remainder = await Remainder.findOne({where: {product_id: +p.id}})
      if (remainder) {
        await Remainder.update({
          residue: remainder.residue - (+p.amount)
        },{
          where: {product_id: +p.id}
        })
        if (remainder.limit >= (remainder.residue - p.amount) && bool == false) {
          bool = true
          io.emit('checkRemainder', true)
        }
      }
    })
    res.send({message: "updated"})
  } catch (e) {
    res.status(500).json(e)
  }
}
