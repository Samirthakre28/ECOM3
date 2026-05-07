import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Checkout() {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleChange = (e) => {
        setAddress({...address, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulated backend call
            // await api.post('/orders', { items: cart, address, total: subtotal });
            setTimeout(() => {
                clearCart();
                navigate('/success');
            }, 1500);
        } catch (error) {
            alert('Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{paddingTop: '150px', textAlign: 'center', minHeight: '60vh'}}>
                <h2>Your cart is empty</h2>
                <Link to="/shop" className="btn btn-primary" style={{marginTop: '20px'}}>Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{paddingTop: '120px', paddingBottom: '100px'}}>
            <h1 className="section-title" style={{textAlign: 'left', marginBottom: '40px'}}>Secure Checkout</h1>
            
            <div className="product-details-container animate-fade-in" style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px', margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none'}}>
                
                <form id="checkout-form" onSubmit={handleSubmit} style={{background: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)'}}>
                    <h3 style={{fontSize: '1.4rem', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px'}}>Shipping Details</h3>
                    
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" required value={address.fullName} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    
                    <div className="form-group">
                        <label>Street Address</label>
                        <input type="text" name="street" required value={address.street} onChange={handleChange} placeholder="123 Thrift Ave, Apt 4" />
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" required value={address.city} onChange={handleChange} placeholder="New York" />
                        </div>
                        <div className="form-group">
                            <label>State / Province</label>
                            <input type="text" name="state" required value={address.state} onChange={handleChange} placeholder="NY" />
                        </div>
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div className="form-group">
                            <label>ZIP / Postal Code</label>
                            <input type="text" name="zipCode" required value={address.zipCode} onChange={handleChange} placeholder="10001" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" required value={address.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                </form>

                <div className="cart-summary" style={{background: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--border-color)', position: 'sticky', top: '120px'}}>
                    <h3 style={{fontSize: '1.4rem', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px'}}>Order Summary</h3>
                    
                    <div style={{marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {cart.map(item => (
                            <div key={item._id} style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)'}}>
                                <span>{item.quantity}x {item.title}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

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
                    <button type="submit" form="checkout-form" disabled={loading} className="btn btn-primary" style={{width: '100%', padding: '16px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1}}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
