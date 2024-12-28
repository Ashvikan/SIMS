import React, { useState, useEffect } from "react";

const CreateOrder = ({ isOpen, onClose, onOrderCreated }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [status, setStatus] = useState("Pending");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load product data. Please try again.");
            }
        };

        fetchProducts();
    }, []);

    // Handle adding a product to the order
    const handleAddProduct = () => {
        if (products.length === 0) {
            setError("No products available to add.");
            return;
        }
        setSelectedProducts((prev) => [
            ...prev,
            { productId: products[0]?.productId || "", quantity: 1 },
        ]);
    };

    // Handle product change
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index][field] = value;
        setSelectedProducts(updatedProducts);
    };

    // Validate order form
    const validateForm = () => {
        if (!customerName) return "Customer name is required.";
        if (selectedProducts.length === 0) return "At least one product must be added.";
        for (const product of selectedProducts) {
            if (!product.productId) return "All products must have a valid Product ID.";
            if (product.quantity <= 0) return "Quantities must be greater than 0.";
        }
        return null;
    };

    // Handle form submission
    const handleCreateOrder = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const orderData = {
            products: selectedProducts.map((p) => ({
                productId: parseInt(p.productId),
                quantity: parseInt(p.quantity),
            })),
            customerName,
            status,
        };

        setIsLoading(true);
        setError(""); // Clear any previous errors
        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create order");
            }

            const result = await response.json();
            alert(result.message); // Display success message
            onOrderCreated(); // Trigger parent refresh
            onClose(); // Close modal
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Order</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form>
                    <div>
                        <label htmlFor="customerName">Customer Name:</label>
                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                    <div>
                        <h3>Products</h3>
                        {selectedProducts.map((product, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <label>Product ID:</label>
                                <select
                                    value={product.productId}
                                    onChange={(e) =>
                                        handleProductChange(index, "productId", e.target.value)
                                    }
                                >
                                    <option value="">Select a product</option>
                                    {products.map((p) => (
                                        <option key={p.productId} value={p.productId}>
                                            {p.productId} - {p.productName}
                                        </option>
                                    ))}
                                </select>
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        handleProductChange(index, "quantity", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddProduct}>
                            Add Product
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleCreateOrder}
                        disabled={isLoading || products.length === 0}
                    >
                        {isLoading ? "Creating Order..." : "Create Order"}
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
