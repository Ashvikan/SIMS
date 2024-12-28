const Product = require('./models/Product');
const logAction = require('./utils/logAction');
const calculateConsumptionRate = require('./utils/logAnalysis');

async function checkAndReorder() {
    try {
        console.log("Running checkAndReorder at:", new Date()); // Log each execution
        const products = await Product.find();

        for (const product of products) {
            console.log(`Checking product: ${product.productName} (ID: ${product.productId})`);
            console.log(`Stock level: ${product.stockLevel}, Reorder Threshold: ${product.reorderThreshold}`);

            // Calculate dynamic threshold
            const dailyRate = await calculateConsumptionRate(product.productId);
            const leadTime = 3; // Example lead time in days
            const safetyStock = 5; // Example safety stock
            const dynamicThreshold = Math.ceil((dailyRate * leadTime) + safetyStock);

            console.log(`Dynamic Threshold: ${dynamicThreshold}`);

            if (product.stockLevel < dynamicThreshold) {
                const reorderQuantity = product.reorderQuantity || 10;

                // Update stock level
                product.stockLevel += reorderQuantity;
                await product.save();

                // Log the reorder action
                await logAction('Dynamic Reorder', {
                    productId: product.productId,
                    productName: product.productName,
                    reorderQuantity,
                    newStockLevel: product.stockLevel,
                }, 'System');

                console.log(`Reordered ${reorderQuantity} units for ${product.productName}`);
            } else {
                console.log(`${product.productName} has sufficient stock. No reorder needed.`);
            }
        }
    } catch (error) {
        console.error("Error checking stock levels for reorder:", error);
    }
}

// Run the function every 5 seconds (or adjust as needed for testing)
setInterval(checkAndReorder, 5000); // 5-second interval for testing

module.exports = checkAndReorder;