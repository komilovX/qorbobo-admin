// const SantaClaus = require("../models/santa_claus.model");

// module.exports.bookDay = async (req, res) => {
//   try {
//     const {
//       date,
//       clientName = null,
//       clientPhone,
//       clientId,
//       address = null
//     } = req.body;

//     const order = await SantaClaus.create({
//       where: {
//         date: new Date(date),
//         clientName,
//         clientPhone,
//         clientId,
//         address
//       }
//     });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports.findAllOrders = async (req, res) => {
//   try {
//     const orders = await SantaClaus.findAll({
//       raw: true,
//       order: [["id", "DESC"]]
//     });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports.findByClientId = async (req, res) => {
//   try {
//     const orders = await SantaClaus.findAll({
//       raw: true,
//       where: { clientId: req.params.id }
//     });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports.updateById = async (req, res) => {
//   try {
//     await SantaClaus.update(
//       {
//         ...req.body
//       },
//       {
//         where: { id: req.params.id }
//       }
//     );
//     const order = await SantaClaus.findByPk(+req.params.id);
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports.deleteById = async (req, res) => {
//   try {
//     await SantaClaus.destroy({
//       where: {
//         id: req.params.id
//       }
//     });
//     res.send("DELETED");
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
