import React, { useState, useEffect } from "react";
import axios from "axios";

function StockTable() {
    const [products, setProducts] = useState([]);
    const [restockAmount, setRestockAmount] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch products from the backend
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchStockData();
        const interval = setInterval(fetchStockData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Handle manual reorder
    const handleReorder = async (productId) => {
        const amount = restockAmount[productId];
        if (!amount || amount <= 0) {
            setError("Enter a valid restock amount.");
            return;
        }

        try {
            await axios.post(`http://localhost:3000/api/products/${productId}/reorder`, {
                restockAmount: parseInt(amount),
            });

            setSuccess(`Successfully reordered stock for Product ID ${productId}`);
            setError("");

            // Update stock levels in the UI
            const updatedProducts = products.map((product) =>
                product.productId === productId
                    ? { ...product, stockLevel: product.stockLevel + parseInt(amount) }
                    : product
            );
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Error reordering stock:", error);
            setError(error.response?.data?.message || "Failed to reorder stock.");
            setSuccess("");
        }
    };


    return (
        <div>
            <h2>Product Stock Levels</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <table>
                <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Stock Level</th>
                    <th>Reorder Threshold</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.productId}>
                        <td>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>{product.stockLevel}</td>
                        <td>{product.reorderThreshold}</td>
                        <td>
                            <input
                                type="number"
                                min="1"
                                placeholder="Enter restock amount"
                                value={restockAmount[product.productId] || ""}
                                onChange={(e) =>
                                    setRestockAmount({
                                        ...restockAmount,
                                        [product.productId]: e.target.value,
                                    })
                                }
                                style={{ marginRight: "0.5rem", padding: "0.2rem" }}
                            />
                            <button onClick={() => handleReorder(product.productId)}>
                                Reorder
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockTable;
