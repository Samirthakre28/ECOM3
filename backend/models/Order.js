const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer_name: String,
    customer_email: String,
    customer_phone: String,
    total_amount: Number,
    shipping_cost: Number,
    status: { type: String, default: 'Pending' },
    payment_id: String,
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        size: String,
        price: Number,
        quantity: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
