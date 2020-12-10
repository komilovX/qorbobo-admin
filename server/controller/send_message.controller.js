const path = require('path');
const fs = require('fs');
const axios = require('axios');

const keys = require('../keys');
const SendMessage = require('../models/send_message.model')


module.exports.findAllMessages = async (req, res) => {
  try {
    const messages = await SendMessage.findAll({raw: true})
    res.json(messages)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.createMessage = async (req, res) => {
  try {
    await SendMessage.create({
      date: req.body.date,
      title: req.body.title,
      title_ru: req.body.title_ru,
      message: req.body.message,
      message_ru: req.body.message_ru,
      photo: `/${req.file.filename}`
    })
    res.json({message: 'created'})
  } catch (error) {
    res.status(500).json(error)
  }
}
module.exports.findById = async (req, res) => {
  try {
    const message = await SendMessage.findByPk(+req.params.id)
    res.json(message)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.updateById = async (req, res) => {
  try {
    await SendMessage.update(req.body,{
      where: {id: +req.params.id}
    })
    res.json({message: 'updated!'})
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    const message = await SendMessage.findByPk(+req.params.id)
    let photo = message.photo.replace('/','')
    let way = path.resolve(__dirname,`../../static/uploads/${photo}`)

    await SendMessage.destroy({
      where: {id: +req.params.id}
    })

    res.json({message: 'deleted!'})
    fs.unlinkSync(way)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.sendMessageNow = async (req, res) => {
  try {
    const text = encodeURI(req.body.message)
    await axios.post(`https://api.telegram.org/bot${keys.TOKEN}/sendMessage?chat_id=${req.body.chat_id}&text=${text}`)

    res.json({message: 'sended!'})
  } catch (error) {
    res.status(500).json(error)
  }
}
