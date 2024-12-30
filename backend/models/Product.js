const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true },
    productName: { type: String, required: true },
    stockLevel: { type: Number, required: true },
    reorderThreshold: { type: Number, default: 10 },
    reorderQuantity: { type: Number, default: 10 },
    lastReorder: { type: Date },
    category: { type: String },
    dynamicReorderEnabled: { type: Boolean, default: false }, // Enable/disable dynamic reorder
    salesHistory: { type: [Number], default: [] }, // Weekly sales data
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
