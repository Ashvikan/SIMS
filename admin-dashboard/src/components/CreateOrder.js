import React, { useState, useEffect } from "react";

const CreateOrder = ({ onOrderCreated }) => {
    const [customerName, setCustomerName] = useState("");
    const [products, setProducts] = useState([{ productId: "", quantity: 1 }]);
    const [availableProducts, setAvailableProducts] = useState([]);

    // Fetch available products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/products");
                const data = await response.json();
                setAvailableProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const addProduct = () => {
        setProducts([...products, { productId: "", quantity: 1 }]);
    };

    const removeProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerName, products }),
            });

            if (response.ok) {
                alert("Order created successfully");
                setCustomerName("");
                setProducts([{ productId: "", quantity: 1 }]);
                onOrderCreated();
            } else {
                alert("Failed to create order");
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div>
            <h3>Create Order</h3>
            <div>
                <label>Customer Name:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>
            {products.map((product, index) => (
                <div key={index}>
                    <label>Product:</label>
                    <select
                        value={product.productId}
                        onChange={(e) =>
                            handleProductChange(index, "productId", e.target.value)
                        }
                    >
                        <option value="">Select Product</option>
                        {availableProducts.map((p) => (
                            <option key={p.productId} value={p.productId}>
                                {p.productName}
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
                    />
                    <button type="button" onClick={() => removeProduct(index)}>
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={addProduct}>
                Add Product
            </button>
            <button type="button" onClick={handleSubmit}>
                Submit Order
            </button>
        </div>
    );
};

export default CreateOrder;
