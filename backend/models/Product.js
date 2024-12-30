const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true, required: true }, // Unique identifier for the product
    productName: { type: String, required: true },            // Name of the product
    stockLevel: { type: Number, required: true },             // Current stock level
    reorderThreshold: { type: Number, default: 10 },          // Minimum stock before reorder
    reorderQuantity: { type: Number, default: 10 },           // Quantity to reorder
    lastReorder: { type: Date },                              // Timestamp of the last reorder
    category: { type: String },                               // Product category
    dynamicReorderEnabled: { type: Boolean, default: false }, // Enable or disable dynamic reorder logic
    salesHistory: {                                           // Store recent sales history for analysis
        type: [Number],                                       // Array of sales numbers (weekly data)
        default: []
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
