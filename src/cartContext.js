import React, { useReducer, useEffect, useContext } from "react";
import cartReducer from "./cartReducer";

const CartContext = React.createContext(null);

let initialCart;
try {
  initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
} catch {
  console.error("The cart could not be parsed into JSON.");
  initialCart = [];
}

export function CartProvider(props) {
  // set initial state by reading local storage.
  // Wrapping it with a function makes it only run once
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // any time the cart changes, store it in localstorage as a json string. Use cart as the key
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const contextValue = {
    cart,
    dispatch,
  };
  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a Cart Provider. Wrap a parent component in <CartProvider> to fix this error."
    );
  }
  return context;
}
