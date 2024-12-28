const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true },
    productName: { type: String, required: true },
    stockLevel: { type: Number, required: true },
    reorderThreshold: { type: Number, default: 10 }, // Minimum stock before reorder
    reorderQuantity: { type: Number, default: 10 },  // Quantity to reorder
    lastReorder: { type: Date },                     // Last reorder timestamp
    category: { type: String },                      // Category of the product
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
