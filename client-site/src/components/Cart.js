import React, { useState } from "react";
import api from "../services/api";

function Cart({ cart, removeFromCart, clearCart }) {
    const [customerName, setCustomerName] = useState("");
    const [error, setError] = useState("");

    const placeOrder = async () => {
        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        const orderData = {
            customerName,
            products: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        console.log("Order Data Sent:", orderData); // Debugging log

        try {
            await api.post("/orders", orderData);
            alert("Order placed successfully!");
            setCustomerName("");
            clearCart();
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Failed to place the order. Please try again.");
        }
    };

    return (
        <div>
            {cart.map((item) => (
                <div key={item.productId} style={{ marginBottom: "10px" }}>
                    <span>{item.productName} x {item.quantity}</span>
                    <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{
                            marginLeft: "10px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            padding: "5px",
                            borderRadius: "5px",
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <hr />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
            />
            <button
                onClick={placeOrder}
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    width: "100%",
                }}
            >
                Place Order
            </button>
        </div>
    );
}

export default Cart;
