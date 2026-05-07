import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const FALLBACK = 'https://via.placeholder.com/120x120?text=Item';
const imgBase = import.meta.env.PROD ? '' : 'http://localhost:5000';

function resolveImg(image) {
    if (!image) return FALLBACK;
    if (image.startsWith('http')) return image;
    return `${imgBase}/${image}`;
}

function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="container" style={{paddingTop: '120px', minHeight: '60vh', paddingBottom: '100px'}}>
            <h1 className="section-title" style={{textAlign: 'left', marginBottom: '40px'}}>Your Cart</h1>

            {cart.length === 0 ? (
                <div style={{textAlign: 'center', padding: '50px', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)'}}>
                    <h2 style={{marginBottom: '20px', color: 'var(--text-muted)'}}>Your cart is empty</h2>
                    <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="product-details-container animate-fade-in" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none'}}>
                    <div className="cart-items">
                        {cart.map(item => {
                            const itemId = item._id || item.id;
                            return (
                                <div key={itemId} style={{display: 'flex', gap: '20px', background: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-color)', position: 'relative'}}>
                                    <img
                                        src={resolveImg(item.image)}
                                        alt={item.title}
                                        style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)'}}
                                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                    />
                                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <div>
                                            <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>{item.title}</h3>
                                            <div style={{color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem'}}>₹{Number(item.price).toFixed(2)}</div>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <div style={{display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflow: 'hidden'}}>
                                                <button onClick={() => updateQuantity(itemId, item.quantity - 1)} style={{background: 'none', border: 'none', borderRight: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 15px', cursor: 'pointer', fontSize: '1.1rem', transition: 'var(--transition)'}}>-</button>
                                                <span style={{padding: '0 15px', fontWeight: '500'}}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(itemId, item.quantity + 1)} style={{background: 'none', border: 'none', borderLeft: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 15px', cursor: 'pointer', fontSize: '1.1rem', transition: 'var(--transition)'}}>+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(itemId)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem'}}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary" style={{background: 'var(--surface-color)', padding: '30px', borderRadius: 'var(--radius-md)', height: 'fit-content', border: '1px solid var(--border-color)', position: 'sticky', top: '120px'}}>
                        <h3 style={{fontSize: '1.5rem', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px'}}>Order Summary</h3>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-muted)'}}>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-muted)'}}>
                            <span>Shipping</span>
                            <span style={{color: '#16a34a'}}>Free</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.4rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
                            <span>Total</span>
                            <span style={{color: 'var(--accent)'}}>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary" style={{width: '100%', padding: '16px', fontSize: '1.1rem', textAlign: 'center'}}>Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
