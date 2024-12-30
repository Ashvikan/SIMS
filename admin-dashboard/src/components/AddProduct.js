import React, { useState } from "react";

const AddProduct = () => {
    const [productDetails, setProductDetails] = useState({
        productId: "",
        productName: "",
        stockLevel: 0,
        reorderThreshold: 10,
        reorderQuantity: 10,
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productDetails),
            });

            if (response.ok) {
                alert("Product added successfully");
                setProductDetails({
                    productId: "",
                    productName: "",
                    stockLevel: 0,
                    reorderThreshold: 10,
                    reorderQuantity: 10,
                    category: "",
                });
            } else {
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div>
            <h3>Add New Product</h3>
            <form>
                <label>Product ID:</label>
                <input
                    type="text"
                    name="productId"
                    value={productDetails.productId}
                    onChange={handleChange}
                />
                <label>Product Name:</label>
                <input
                    type="text"
                    name="productName"
                    value={productDetails.productName}
                    onChange={handleChange}
                />
                <label>Stock Level:</label>
                <input
                    type="number"
                    name="stockLevel"
                    value={productDetails.stockLevel}
                    onChange={handleChange}
                />
                <label>Reorder Threshold:</label>
                <input
                    type="number"
                    name="reorderThreshold"
                    value={productDetails.reorderThreshold}
                    onChange={handleChange}
                />
                <label>Reorder Quantity:</label>
                <input
                    type="number"
                    name="reorderQuantity"
                    value={productDetails.reorderQuantity}
                    onChange={handleChange}
                />
                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={productDetails.category}
                    onChange={handleChange}
                />
                <button type="button" onClick={handleSubmit}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
