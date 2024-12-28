import React, { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        const exists = cart.find((item) => item.productId === product.productId);

        if (exists) {
            if (exists.quantity < product.stockLevel) {
                setCart(
                    cart.map((item) =>
                        item.productId === product.productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                alert("Cannot add more than available stock!");
            }
        } else {
            if (product.stockLevel > 0) {
                setCart([...cart, { ...product, quantity: 1 }]);
            } else {
                alert("Product is out of stock!");
            }
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.productId !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 3, padding: "10px" }}>
                <h1>Products</h1>
                <ProductList addToCart={addToCart} />
            </div>
            <div style={{ flex: 1, padding: "10px", backgroundColor: "#f9f9f9" }}>
                <h1>Your Cart</h1>
                <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />
            </div>
        </div>
    );
}

export default App;
