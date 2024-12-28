import React, { useState, useEffect } from "react";
import api from "../services/api";

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {products.map((product) => (
                <div
                    key={product.productId}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "5px",
                        textAlign: "center",
                    }}
                >
                    <h3>{product.productName}</h3>
                    <p>Stock: {product.stockLevel}</p>
                    <button
                        style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "10px" }}
                        onClick={() => addToCart(product)}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
