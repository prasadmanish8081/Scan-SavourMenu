const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));


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
