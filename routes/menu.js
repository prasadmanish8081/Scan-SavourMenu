const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomerUser"
    },
});

module.exports = mongoose.model('menu', menuSchema);