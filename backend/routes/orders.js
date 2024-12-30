const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const logAction = require('../utils/logAction');

// Create Order Route
router.post('/', async (req, res) => {
    try {
        const { customerName, status, products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No products in the order." });
        }

        const newOrder = new Order({
            customerName,
            status: status || 'Pending',
            products,
        });

        // Check stock levels for each product and update sales history
        for (const item of products) {
            const product = await Product.findOne({ productId: item.productId });
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }
            if (product.stockLevel < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for Product ID ${item.productId}.` });
            }

            // Reduce stock level
            product.stockLevel -= item.quantity;

            // Update sales history (add weekly sales to history)
            const salesHistory = product.salesHistory || [];
            salesHistory.push(item.quantity);
            if (salesHistory.length > 10) salesHistory.shift(); // Keep the last 10 weeks of data
            product.salesHistory = salesHistory;

            await product.save();
        }


        // Determine who performed the action
        const performedBy = customerName ? `Client: ${customerName}` : "Admin";
        console.log("Performed By:", performedBy); // Debugging log
        await logAction('Order Created', { orderId: newOrder._id, products }, performedBy);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order.', error: error.message });
    }
});

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: 'Error fetching order.', error: error.message });
    }
});

// Update order status by ID
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const oldStatus = order.status;
        order.status = status || order.status;
        await order.save();

        // Log the status update
        await logAction('Order Status Updated', {
            orderId: order._id,
            oldStatus,
            newStatus: order.status,
        }, "Admin");

        res.json({ message: 'Order updated successfully.', order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: 'Error updating order.', error: error.message });
    }
});

// Delete order by ID
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Log the order cancellation
        await logAction('Order Canceled', {
            orderId: order._id,
            products: order.products,
        }, "Admin");

        res.json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: 'Error deleting order.', error: error.message });
    }
});

module.exports = router;
