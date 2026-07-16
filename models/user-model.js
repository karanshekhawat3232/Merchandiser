const mongoose = require('mongoose');
const crypto = require('crypto');

const purchaseItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String
}, { _id: false });

const purchaseHistorySchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: () => crypto.randomUUID()
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    items: [purchaseItemSchema],
    totalAmount: Number
}, { _id: false });

const userSchema = mongoose.Schema({
    Name: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    orders: [],
    contact: Number,
    picture: String,
    purchaseHistory: [purchaseHistorySchema]
});

module.exports = mongoose.model('user', userSchema);