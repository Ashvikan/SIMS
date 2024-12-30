import React, { useState, useEffect } from "react";
import CreateOrder from "./CreateOrder";
import AddProduct from "./AddProduct"; // New Component

const OrderManagement = () => {
    const [activeTab, setActiveTab] = useState("createOrder");
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/orders");
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const renderTabContent = () => {
        if (activeTab === "createOrder") {
            return <CreateOrder onOrderCreated={fetchOrders} />;
        } else if (activeTab === "addProduct") {
            return <AddProduct />;
        } else if (activeTab === "viewOrders") {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.customerName}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div>
            <h2>Order & Product Management</h2>
            <div>
                <button onClick={() => setActiveTab("createOrder")}>Create Order</button>
                <button onClick={() => setActiveTab("addProduct")}>Add Product</button>
                <button onClick={() => setActiveTab("viewOrders")}>View Orders</button>
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

export default OrderManagement;
