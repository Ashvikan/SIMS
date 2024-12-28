const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust path if necessary

// Low-stock notification route
router.get('/api/notifications', async (req, res) => {
    try {
        // Query products where stockLevel is less than reorderThreshold
        const lowStockProducts = await Product.find({
            $expr: { $lt: ["$stockLevel", "$reorderThreshold"] } // Compare fields within the document
        });

        // Create a notification message for each low-stock product
        const notifications = lowStockProducts.map(product => ({
            productId: product.productId,
            message: `Low stock alert: ${product.productName} - Only ${product.stockLevel} left in stock.`,
        }));

        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

module.exports = router;
