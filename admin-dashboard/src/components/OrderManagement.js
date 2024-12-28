import React, { useState } from "react";
import CreateOrder from "./CreateOrder"; // Import the updated component

const OrderManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    // Fetch Orders Function
    const fetchOrders = async () => {
        const response = await fetch("http://localhost:3000/api/orders");
        const data = await response.json();
        setOrders(data);
    };

    // Open/Close Modal Handlers
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Callback for order creation
    const handleOrderCreated = () => {
        fetchOrders(); // Refresh the order list
    };

    return (
        <div>
            <h2>Order Management</h2>
            <button onClick={handleOpenModal}>Create New Order</button>

            {/* Render Orders */}
            <table>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Customer Name</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.productId}</td>
                        <td>{order.quantity}</td>
                        <td>{order.customerName}</td>
                        <td>{order.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal */}
            <CreateOrder
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onOrderCreated={handleOrderCreated}
            />
        </div>
    );
};

export default OrderManagement;
