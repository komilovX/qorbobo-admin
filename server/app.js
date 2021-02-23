const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const passport = require("passport");
const passportStrategy = require("./middleware/passport");
const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const supplierRoutes = require("./routes/storage.routes");
const sendMessageRoutes = require("./routes/send_message.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const statisticRoutes = require("./routes/statistic.routes");
const deliveryRoutes = require("./routes/delivery.routes");

const sequelize = require("./database");
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => console.log(`Database error: ${err}`));

app.use(passport.initialize());
passport.use(passportStrategy);

app.use(bodyParser.urlencoded({ useCreateIndex: true, extended: true }));
app.use(bodyParser.json());

global.io = io;
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/storage", supplierRoutes);
app.use("/api/send_message", sendMessageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/delivery", deliveryRoutes);

module.exports = { app, http };
