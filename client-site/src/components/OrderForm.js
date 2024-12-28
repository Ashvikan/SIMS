import React, { useState } from "react";
import api from "../services/api";

function OrderForm({ cart, clearCart }) {
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        const orderData = {
            customerName,
            address,
            products: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        try {
            await api.post("/orders", orderData);
            alert("Order placed successfully!");
            clearCart();
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Failed to place the order. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Place Your Order</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit Order</button>
        </form>
    );
}

export default OrderForm;
