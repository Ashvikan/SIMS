const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mqtt = require("mqtt");

// Models
const Product = require("./models/Product");

// Utilities
const logAction = require("./utils/logAction");
const checkAndReorder = require("./utils/reorder"); // Import automatic reorder logic

const app = express();
app.use(cors());
app.use(express.json());

// Connect to dockerized MongoDB
mongoose
    .connect(process.env.MONGO_URI,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Could not connect to MongoDB:", error));


// Basic test route
app.get("/", (req, res) => {
    res.send("Welcome to SIMS Backend");
});

// Import and use route files
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const notificationRoutes = require("./routes/notifications");
const auditTrailRoutes = require("./routes/auditTrails");

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(auditTrailRoutes);
app.use(notificationRoutes);

// MQTT Client Setup
const mqttClient = mqtt.connect("mqtt://100.80.105.53:1883"); // Using Tailscale IP of MQTT broker

// const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

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

            const product = await Product.findOne({ productId: data.productId });
            if (product) {
                const previousStock = product.stockLevel;
                product.stockLevel = data.stockLevel;
                await product.save();

                console.log(`Updated stock for product ${data.productId}: ${data.stockLevel}`);

                // Log stock update
                await logAction(
                    "Stock Updated",
                    {
                        productId: data.productId,
                        productName: product.productName,
                        previousStock,
                        newStock: data.stockLevel,
                    },
                    "System"
                );

                // Trigger reorder if stock level is below threshold
                if (product.stockLevel < product.reorderThreshold) {
                    console.log(`Stock level for product ${product.productName} is below threshold. Reordering...`);
                    const reorderQuantity = product.reorderQuantity || 10;
                    product.stockLevel += reorderQuantity;
                    await product.save();

                    console.log(`Reordered ${reorderQuantity} units for product ${product.productName}`);

                    // Log reorder action
                    await logAction(
                        "Reorder Triggered",
                        {
                            productId: product.productId,
                            productName: product.productName,
                            reorderQuantity,
                            newStockLevel: product.stockLevel,
                        },
                        "System"
                    );
                }
            } else {
                console.warn(`Product with ID ${data.productId} not found`);
            }
        } catch (error) {
            console.error("Error processing MQTT message:", error.message);
        }
    }
});

// Automatic reorder setup
setInterval(async () => {
    try {
        console.log("Automatic reorder triggered...");
        await checkAndReorder(); // Execute reorder logic periodically
    } catch (error) {
        console.error("Error in automatic reorder:", error.message);
    }
}, 1 * 60 * 1000); // Refresh hvert minut

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
