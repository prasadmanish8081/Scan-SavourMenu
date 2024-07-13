const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/qrmenuscan");



const customerSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  shopname: String,
  type: String,
  location: String,
  contact: Number,
  picture: String,
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "menu" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
});



customerSchema.plugin(plm);

module.exports = mongoose.model("CustomerUser", customerSchema);
