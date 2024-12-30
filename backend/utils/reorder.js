const Product = require('../models/Product');
const logAction = require('./logAction');

/**
 * Perform periodic stock checks and reorder if necessary
 */
async function checkAndReorder() {
    try {
        console.log("Automatic reorder triggered at:", new Date());

        // Fetch all products
        const products = await Product.find();

        for (const product of products) {
            console.log(`Checking product: ${product.productName} (ID: ${product.productId})`);
            console.log(`Stock Level: ${product.stockLevel}, Reorder Threshold: ${product.reorderThreshold}`);

            // Use reorderThreshold directly
            const dynamicThreshold = product.reorderThreshold;

            if (product.stockLevel < dynamicThreshold) {
                const reorderQuantity = product.reorderQuantity || 10;

                // Update stock level
                product.stockLevel += reorderQuantity;
                product.lastReorder = new Date(); // Optional: Track the last reorder time
                await product.save();

                console.log(`Reordered ${reorderQuantity} units for ${product.productName}`);

                // Log the reorder action
                await logAction(
                    'Dynamic Reorder',
                    {
                        productId: product.productId,
                        productName: product.productName,
                        reorderQuantity,
                        newStockLevel: product.stockLevel,
                    },
                    'System'
                );
            } else {
                console.log(`${product.productName} has sufficient stock. No reorder needed.`);
            }
        }
    } catch (error) {
        console.error("Error in automatic reorder process:", error.message);
    }
}

module.exports = checkAndReorder;
