import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const { cart } = useCart();
    const [search, setSearch] = useState('');
    
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if(search.trim()) {
            navigate(`/shop?search=${encodeURIComponent(search)}`);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">✨</span> Thrifty
                </Link>
                <nav className="nav-links">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
                    {token ? (
                        <>
                            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
                            <button onClick={logout} style={{background:'none', border:'none', cursor:'pointer', fontSize: '1rem', fontWeight: '500', color: 'var(--text-main)', padding: '5px 15px'}}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
                    )}
                </nav>
                <div className="nav-icons">
                    <form onSubmit={handleSearch} className="search-container">
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="submit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </form>
                    <Link to="/cart" className="cart-icon-container">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                    <button className="mobile-menu-btn">☰</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
