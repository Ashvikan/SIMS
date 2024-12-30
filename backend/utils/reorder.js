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

            let dynamicThreshold = product.reorderThreshold;
            let reorderQuantity = product.reorderQuantity;

            // Determine if dynamic reorder applies
            if (product.dynamicReorderEnabled && product.salesHistory.length >= 3) {
                const averageSales = product.salesHistory.reduce((sum, sales) => sum + sales, 0) / product.salesHistory.length;
                dynamicThreshold = Math.ceil(averageSales * 1.5);
                reorderQuantity = Math.max(Math.ceil(averageSales * 2), product.reorderQuantity);

                console.log(`Dynamic reorder triggered for ${product.productName}.`);
                console.log(`Dynamic Threshold: ${dynamicThreshold}, Dynamic Reorder Quantity: ${reorderQuantity}`);
            } else {
                console.log(`Rule-based reorder used for ${product.productName}.`);
            }

            // Reorder logic
            if (product.stockLevel < dynamicThreshold) {
                product.stockLevel += reorderQuantity;
                product.lastReorder = new Date();
                await product.save();

                console.log(`Reordered ${reorderQuantity} units for ${product.productName}`);

                // Log action to the audit trail
                await logAction(
                    'Dynamic Reorder',
                    {
                        productId: product.productId,
                        productName: product.productName,
                        reorderQuantity,
                        newStockLevel: product.stockLevel,
                        dynamicReorder: product.dynamicReorderEnabled,
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
