const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mqtt = require("mqtt");

// Models
const Product = require("./models/Product");

// Utilities
const logAction = require("./utils/logAction");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/SIMS", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Could not connect to MongoDB:", error));

// Basic test route
app.get("/", (req, res) => {
    res.send("Welcome to SIMS Backend");
});

// Import and use the separate route files
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const notificationRoutes = require("./routes/notifications");
const auditTrailRoutes = require("./routes/auditTrails");

app.use(auditTrailRoutes);
app.use(notificationRoutes);
app.use("/api/products", productRoutes); // All product routes will start with /api/products
app.use("/api/orders", orderRoutes); // All order routes will start with /api/orders

// MQTT Client Setup
const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    // Subscribe to the "stock/update" topic
    mqttClient.subscribe("stock/update", (err) => {
        if (err) {
            console.error("Failed to subscribe to topic:", err);
        } else {
            console.log("Subscribed to topic: stock/update");
        }
    });
});

mqttClient.on("message", async (topic, message) => {
    if (topic === "stock/update") {
        try {
            const data = JSON.parse(message.toString());
            console.log("Received stock update:", data);

            // Update product stock level in the database
            const product = await Product.findOne({ productId: data.productId });
            if (product) {
                const previousStock = product.stockLevel;
                product.stockLevel = data.stockLevel;
                await product.save();

                console.log(`Updated stock for product ${data.productId}: ${data.stockLevel}`);

                // Log the stock update
                await logAction(
                    "Stock Updated",
                    {
                        productId: data.productId,
                        previousStock,
                        newStock: data.stockLevel,
                    },
                    "System"
                );

                // Reorder logic if stock is below the threshold
                if (product.stockLevel < product.reorderThreshold) {
                    const reorderQuantity = product.reorderQuantity || 10; // Default to 10 if not specified
                    const newStockLevel = product.stockLevel + reorderQuantity;

                    // Simulate reorder by updating stock
                    product.stockLevel = newStockLevel;
                    await product.save();

                    console.log(
                        `Reordered ${reorderQuantity} units for product ${data.productId}. New stock: ${newStockLevel}`
                    );

                    // Log the reorder action
                    await logAction(
                        "Reorder Triggered",
                        {
                            productId: data.productId,
                            reorderQuantity,
                            newStockLevel,
                        },
                        "System"
                    );
                }
            } else {
                console.warn(`Product with ID ${data.productId} not found`);
            }
        } catch (error) {
            console.error("Error processing MQTT message:", error);
        }
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
