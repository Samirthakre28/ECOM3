import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// The Python SQLite API returns `id`, MongoDB returns `_id`.
// This helper normalises both so cart matching always works.
const getProductId = (product) => product._id || product.id;

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        const pid = getProductId(product);
        setCart(prev => {
            const exists = prev.find(item => getProductId(item) === pid);
            if (exists) {
                return prev.map(item =>
                    getProductId(item) === pid
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => getProductId(item) !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCart(prev => prev.map(item =>
            getProductId(item) === id ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
