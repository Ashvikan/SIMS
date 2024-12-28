const mqtt = require("mqtt");

const mqttClient = mqtt.connect("mqtt://localhost:1883"); // Connect to the MQTT broker

// Sample products to simulate
const products = [
    { productId: 1, stockLevel: 50 },
    { productId: 2, stockLevel: 75 },
    { productId: 3, stockLevel: 30 },
];

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    setInterval(() => {
        // Simulate an update for each product
        products.forEach((product) => {
            // Simulate a stock change event
            const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
            product.stockLevel = Math.max(0, product.stockLevel + change); // Ensure stock does not go below 0

            const simulatedData = {
                productId: product.productId,
                stockLevel: product.stockLevel,
                timestamp: new Date().toISOString(),
            };

            mqttClient.publish("stock/update", JSON.stringify(simulatedData), (err) => {
                if (err) {
                    console.error("Failed to publish message:", err);
                } else {
                    console.log("Published:", JSON.stringify(simulatedData));
                }
            });
        });
    }, 10000); // Publish updates every 10 seconds
});
