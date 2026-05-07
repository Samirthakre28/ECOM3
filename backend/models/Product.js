const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    size: { type: String },
    condition: { type: String },
    category: { type: String },
    image: { type: String },
    images: [{ type: String }],
    badge: { type: String },
    description: { type: String },
    stock_status: { type: String, default: 'In Stock' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
