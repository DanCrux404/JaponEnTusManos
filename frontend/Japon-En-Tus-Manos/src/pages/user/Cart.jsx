import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../services/sales";
import { decreaseStock } from "../../services/products";
import "../../styles/Cart.css";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    const [paymentMethod, setPaymentMethod] = useState("Credit Card"); // Selector

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const total = cart.reduce(
        (sum, item) => sum + item.Quantity * item.UnitPrice,
        0
    );

    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Carrito vacío");

        const user = JSON.parse(localStorage.getItem("user"));
        console.log("Usuario completo:", user); // 👈 AGREGA ESTO
        console.log("UserID:", user.UserID);    // 👈 Y ESTO
        if (!user) return alert("Debes iniciar sesión");

        const saleData = {
            UserID: user.UserID,
            Total: total,
            PaymentStatus: "Pending",
            PaymentMethod: paymentMethod,
            Items: cart.map((item) => ({
                ProductID: item.ProductID,
                Quantity: item.Quantity,
                UnitPrice: item.UnitPrice,
            })),
        };

        console.log("Datos que se enviarán al backend:", saleData);

        try {
            const result = await createSale(saleData);

            alert("Compra realizada con éxito");
            setCart([]);
            localStorage.removeItem("cart");
            navigate("/UserHome");
        } catch (err) {
            console.error(err);
            alert("Error al crear la venta: " + err.message);
        }
    };

    if (cart.length === 0)
        return (
            <div className="cart-empty">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos desde la tienda.</p>
            </div>
        );

    return (
        <div className="cart-container">
            <h2>Tu Carrito</h2>
            <div className="cart-items">
                {cart.map((item) => (
                    <div className="cart-item" key={item.ProductID}>
                        <div className="item-info">
                            <img src={item.ImageURL} alt={item.ProductName} />
                            <div>
                                <h4>{item.ProductName}</h4>
                                <p>Cantidad: {item.Quantity}</p>
                                <p>Precio unitario: ${item.UnitPrice}</p>
                            </div>
                        </div>
                        <div className="item-total">${item.Quantity * item.UnitPrice}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <label htmlFor="payment">Método de pago:</label>
                <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ padding: "5px 10px", borderRadius: "6px" }}
                >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                </select>
            </div>

            <h3 className="cart-total">Total: ${total.toFixed(2)}</h3>

            <div style={{ display: "flex", gap: "10px" }}>
                <button className="checkout-btn" onClick={handleCheckout}>
                    Pagar
                </button>
                <button
                    className="clear-btn"
                    onClick={() => {
                        setCart([]);
                        localStorage.removeItem("cart");
                    }}
                >
                    Vaciar carrito
                </button>
            </div>
        </div>
    );
}

export default Cart;
