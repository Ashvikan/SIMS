const express = require('express');
const router = express.Router();
const Product = require('../models/Product');  // Import the Product model
const logAction = require('../utils/logAction');

// Add Product Route
router.post('/', async (req, res) => {
    try {
        const { productId, productName, stockLevel, reorderThreshold, category } = req.body;
        const newProduct = new Product({
            productId,
            productName,
            stockLevel,
            reorderThreshold,
            category,
        });
        await newProduct.save();

        // Log the product addition
        await logAction('Product Added', {
            productId: newProduct.productId,
            productName: newProduct.productName,
        }, 'Admin');

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});


// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// GET product by ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// PUT update product by ID
router.put('/:productId', async (req, res) => {
    try {
        const { stockLevel } = req.body; // New stock level from the request
        const product = await Product.findOne({ productId: req.params.productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const oldStockLevel = product.stockLevel; // Save the old stock level for logging
        product.stockLevel = stockLevel || product.stockLevel; // Update stock level
        await product.save();

        // Log the stock update action
        await logAction('Stock Updated', {
            productId: product.productId,
            oldStockLevel,
            newStockLevel: product.stockLevel,
        }, 'Admin');

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});


// DELETE product by ID
router.delete('/:productId', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ productId: req.params.productId });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await logAction('Product Deleted', { productId: req.params.productId }, 'Admin');

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

router.post('/:productId/reorder', async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId
        const { restockAmount } = req.body; // Extract restockAmount

        if (restockAmount <= 0) {
            return res.status(400).json({ message: 'Restock amount must be positive.' });
        }

        const product = await Product.findOne({ productId }); // Find product by productId
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.stockLevel += restockAmount; // Update stockLevel
        await product.save();

        await logAction('Stock Reordered', { productId, restockAmount }, 'Admin');

        res.status(200).json({ message: 'Stock successfully reordered', product });
    } catch (error) {
        console.error("Error reordering stock:", error);
        res.status(500).json({ message: 'Error reordering stock', error: error.message });
    }
});


module.exports = router;
