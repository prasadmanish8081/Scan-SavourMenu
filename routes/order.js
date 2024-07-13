const mongoose = require('mongoose');

const customerOrderSchema = new mongoose.Schema({
  items: [{
    name: String,
    price: Number,
    quantity: Number,  
  }],
  total: Number,
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerUser',
  },
},{ timestamps: true });

module.exports = mongoose.model('order', customerOrderSchema);
