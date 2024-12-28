const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true }, // Unique order identifier as a string
    customerName: { type: String, required: true },
    products: [
        {
            productId: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
});

// Pre-save hook to generate a unique orderId
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        // Generate a unique orderId using timestamp and a random number
        this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Example: ORD-1670001234567-1234
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
