import React, { useEffect, useState } from "react";

const PendingOrders = () => {
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/orders");
                const data = await response.json();
                const filteredOrders = data.filter((order) => order.status === "Pending");
                setPendingOrders(filteredOrders);
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            }
        };

        fetchPendingOrders();
    }, []);

    return (
        <div>
            <h2>Pending Orders</h2>
            <table>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Products</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {pendingOrders.map((order) => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.customerName}</td>
                        <td>
                            {order.products.map((p, idx) => (
                                <div key={idx}>
                                    {p.productId} x {p.quantity}
                                </div>
                            ))}
                        </td>
                        <td>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `http://localhost:3000/api/orders/${order._id}`,
                                            { method: "PUT", body: JSON.stringify({ status: "Approved" }) }
                                        );
                                        if (response.ok) alert("Order Approved");
                                    } catch (error) {
                                        console.error("Error updating order status:", error);
                                    }
                                }}
                            >
                                Approve
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `http://localhost:3000/api/orders/${order._id}`,
                                            { method: "DELETE" }
                                        );
                                        if (response.ok) alert("Order Canceled");
                                    } catch (error) {
                                        console.error("Error canceling order:", error);
                                    }
                                }}
                            >
                                Cancel
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PendingOrders;
